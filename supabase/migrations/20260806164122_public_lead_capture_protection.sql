create table private.lead_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null,
  accepted_count integer not null,
  updated_at timestamptz not null default clock_timestamp(),

  constraint lead_rate_limits_key_hash_check check (key_hash ~ '^[0-9a-f]{64}$'),
  constraint lead_rate_limits_accepted_count_check check (accepted_count > 0)
);

create table private.lead_submission_receipts (
  idempotency_key uuid primary key,
  request_hash text not null,
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  created_at timestamptz not null default clock_timestamp(),

  constraint lead_submission_receipts_request_hash_check check (
    request_hash ~ '^[0-9a-f]{64}$'
  )
);

create index lead_rate_limits_updated_at_idx
  on private.lead_rate_limits (updated_at);

create index lead_submission_receipts_created_at_idx
  on private.lead_submission_receipts (created_at);

alter table private.lead_rate_limits enable row level security;
alter table private.lead_submission_receipts enable row level security;

revoke all on table private.lead_rate_limits from public, anon, authenticated;
revoke all on table private.lead_submission_receipts from public, anon, authenticated;

revoke execute on function public.submit_lead(text, text, boolean, text, uuid, text, text)
  from public, anon, authenticated;

drop function public.submit_lead(text, text, boolean, text, uuid, text, text);

create function public.submit_lead(
  p_name text,
  p_contact text,
  p_consent_given boolean,
  p_ip_hash text,
  p_idempotency_key uuid,
  p_package_interest_id uuid default null,
  p_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  submission_time constant timestamptz := clock_timestamp();
  normalized_name text := btrim(p_name);
  normalized_contact text := btrim(p_contact);
  normalized_message text := nullif(btrim(p_message), '');
  normalized_ip_hash text := lower(btrim(p_ip_hash));
  calculated_request_hash text;
  global_key_hash constant text := encode(
    extensions.digest('biotact-public-lead-global-rate-limit', 'sha256'),
    'hex'
  );
  existing_request_hash text;
  new_lead_id uuid;
  rate_limit_updated boolean;
begin
  if normalized_name is null
    or char_length(normalized_name) not between 1 and 100 then
    raise exception using
      errcode = '22023',
      message = 'invalid_lead_submission';
  end if;

  if normalized_contact is null
    or char_length(normalized_contact) not between 3 and 254 then
    raise exception using
      errcode = '22023',
      message = 'invalid_lead_submission';
  end if;

  if normalized_message is not null and char_length(normalized_message) > 2000 then
    raise exception using
      errcode = '22023',
      message = 'invalid_lead_submission';
  end if;

  if p_consent_given is not true then
    raise exception using
      errcode = '22023',
      message = 'consent_required';
  end if;

  if normalized_ip_hash is null or normalized_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception using
      errcode = '22023',
      message = 'invalid_lead_submission';
  end if;

  if p_idempotency_key is null then
    raise exception using
      errcode = '22023',
      message = 'invalid_lead_submission';
  end if;

  if p_package_interest_id is not null and not exists (
    select 1
    from public.packages
    where id = p_package_interest_id
      and active
  ) then
    raise exception using
      errcode = '22023',
      message = 'invalid_package_interest';
  end if;

  calculated_request_hash := encode(
    extensions.digest(
      concat_ws(
        E'\x1f',
        normalized_name,
        normalized_contact,
        coalesce(p_package_interest_id::text, ''),
        coalesce(normalized_message, ''),
        'privacy-v1'
      ),
      'sha256'
    ),
    'hex'
  );

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_idempotency_key::text, 0)
  );

  select request_hash
  into existing_request_hash
  from private.lead_submission_receipts
  where idempotency_key = p_idempotency_key;

  if found then
    if existing_request_hash = calculated_request_hash then
      return false;
    end if;

    raise exception using
      errcode = '22023',
      message = 'idempotency_key_reused';
  end if;

  insert into private.lead_rate_limits (
    key_hash,
    window_started_at,
    accepted_count,
    updated_at
  )
  values (normalized_ip_hash, submission_time, 1, submission_time)
  on conflict (key_hash) do update
  set
    window_started_at = case
      when private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
        then submission_time
      else private.lead_rate_limits.window_started_at
    end,
    accepted_count = case
      when private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
        then 1
      else private.lead_rate_limits.accepted_count + 1
    end,
    updated_at = submission_time
  where private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
    or private.lead_rate_limits.accepted_count < 5
  returning true into rate_limit_updated;

  if rate_limit_updated is not true then
    raise exception using
      errcode = 'P0001',
      message = 'rate_limit_exceeded';
  end if;

  rate_limit_updated := null;

  insert into private.lead_rate_limits (
    key_hash,
    window_started_at,
    accepted_count,
    updated_at
  )
  values (global_key_hash, submission_time, 1, submission_time)
  on conflict (key_hash) do update
  set
    window_started_at = case
      when private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
        then submission_time
      else private.lead_rate_limits.window_started_at
    end,
    accepted_count = case
      when private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
        then 1
      else private.lead_rate_limits.accepted_count + 1
    end,
    updated_at = submission_time
  where private.lead_rate_limits.window_started_at <= submission_time - interval '10 minutes'
    or private.lead_rate_limits.accepted_count < 100
  returning true into rate_limit_updated;

  if rate_limit_updated is not true then
    raise exception using
      errcode = 'P0001',
      message = 'rate_limit_exceeded';
  end if;

  insert into public.leads (
    name,
    contact,
    channel,
    package_interest_id,
    message,
    status,
    consent_given,
    consent_version,
    consented_at
  )
  values (
    normalized_name,
    normalized_contact,
    'website',
    p_package_interest_id,
    normalized_message,
    'novo',
    true,
    'privacy-v1',
    submission_time
  )
  returning id into new_lead_id;

  insert into private.lead_submission_receipts (
    idempotency_key,
    request_hash,
    lead_id,
    created_at
  )
  values (
    p_idempotency_key,
    calculated_request_hash,
    new_lead_id,
    submission_time
  );

  return true;
end;
$$;

create function private.cleanup_lead_capture_records()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_rate_limits bigint;
  deleted_receipts bigint;
begin
  delete from private.lead_rate_limits
  where updated_at < clock_timestamp() - interval '1 day';
  get diagnostics deleted_rate_limits = row_count;

  delete from private.lead_submission_receipts
  where created_at < clock_timestamp() - interval '1 day';
  get diagnostics deleted_receipts = row_count;

  return deleted_rate_limits + deleted_receipts;
end;
$$;

revoke execute on function public.submit_lead(text, text, boolean, text, uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.submit_lead(text, text, boolean, text, uuid, uuid, text)
  to anon;

revoke execute on function private.cleanup_lead_capture_records()
  from public, anon, authenticated;
