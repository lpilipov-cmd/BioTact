alter table public.leads
  add column request_type text not null default 'enquiry',
  add constraint leads_request_type_check check (
    request_type in ('enquiry', 'cart_order')
  );

create table public.lead_items (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null,
  unit_catalogue_price_eur numeric(10,2) not null,
  product_name_snapshot text not null,
  created_at timestamptz not null default now(),

  constraint lead_items_lead_product_unique unique (lead_id, product_id),
  constraint lead_items_quantity_check check (quantity between 1 and 99),
  constraint lead_items_price_check check (unit_catalogue_price_eur >= 0),
  constraint lead_items_product_name_check check (
    char_length(btrim(product_name_snapshot)) between 1 and 160
  )
);

create index lead_items_lead_id_idx on public.lead_items (lead_id);
create index lead_items_product_id_idx on public.lead_items (product_id);

alter table public.lead_items enable row level security;

revoke all on table public.lead_items from public, anon, authenticated;
grant select on table public.lead_items to authenticated;

create policy "administrators can read lead items"
on public.lead_items for select to authenticated
using ((select private.is_admin()));

create function public.submit_cart_lead(
  p_name text,
  p_contact text,
  p_consent_given boolean,
  p_ip_hash text,
  p_idempotency_key uuid,
  p_items jsonb,
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
  canonical_items text;
  global_key_hash constant text := encode(
    extensions.digest('biotact-public-lead-global-rate-limit', 'sha256'),
    'hex'
  );
  existing_request_hash text;
  new_lead_id uuid;
  rate_limit_updated boolean;
  expected_item_count integer;
  inserted_item_count integer;
begin
  if normalized_name is null
    or char_length(normalized_name) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'invalid_cart_submission';
  end if;

  if normalized_contact is null
    or char_length(normalized_contact) not between 3 and 254 then
    raise exception using errcode = '22023', message = 'invalid_cart_submission';
  end if;

  if normalized_message is not null and char_length(normalized_message) > 2000 then
    raise exception using errcode = '22023', message = 'invalid_cart_submission';
  end if;

  if p_consent_given is not true then
    raise exception using errcode = '22023', message = 'consent_required';
  end if;

  if normalized_ip_hash is null or normalized_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'invalid_cart_submission';
  end if;

  if p_idempotency_key is null then
    raise exception using errcode = '22023', message = 'invalid_cart_submission';
  end if;

  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) not between 1 and 20 then
    raise exception using errcode = '22023', message = 'invalid_cart_items';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as entry(item)
    where jsonb_typeof(item) <> 'object'
      or not (item ? 'productId' and item ? 'quantity')
      or item - 'productId' - 'quantity' <> '{}'::jsonb
      or jsonb_typeof(item -> 'productId') <> 'string'
      or jsonb_typeof(item -> 'quantity') <> 'number'
      or (item ->> 'productId') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or (item ->> 'quantity') !~ '^[1-9][0-9]?$'
  ) then
    raise exception using errcode = '22023', message = 'invalid_cart_items';
  end if;

  expected_item_count := jsonb_array_length(p_items);

  if (
    select count(distinct lower(item ->> 'productId'))
    from jsonb_array_elements(p_items) as entry(item)
  ) <> expected_item_count then
    raise exception using errcode = '22023', message = 'duplicate_cart_items';
  end if;

  if (
    select count(*)
    from jsonb_array_elements(p_items) as entry(item)
    join public.products
      on products.id = (item ->> 'productId')::uuid
      and products.active
      and products.catalogue_price_eur is not null
      and products.currency = 'EUR'
  ) <> expected_item_count then
    raise exception using errcode = '22023', message = 'invalid_cart_product';
  end if;

  select string_agg(
    lower(item ->> 'productId') || ':' || (item ->> 'quantity'),
    ',' order by lower(item ->> 'productId')
  )
  into canonical_items
  from jsonb_array_elements(p_items) as entry(item);

  calculated_request_hash := encode(
    extensions.digest(
      concat_ws(
        E'\x1f',
        normalized_name,
        normalized_contact,
        canonical_items,
        coalesce(normalized_message, ''),
        'privacy-v1',
        'cart-order-v1'
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

    raise exception using errcode = '22023', message = 'idempotency_key_reused';
  end if;

  insert into private.lead_rate_limits (
    key_hash, window_started_at, accepted_count, updated_at
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
    raise exception using errcode = 'P0001', message = 'rate_limit_exceeded';
  end if;

  rate_limit_updated := null;

  insert into private.lead_rate_limits (
    key_hash, window_started_at, accepted_count, updated_at
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
    raise exception using errcode = 'P0001', message = 'rate_limit_exceeded';
  end if;

  insert into public.leads (
    name,
    contact,
    channel,
    message,
    status,
    consent_given,
    consent_version,
    consented_at,
    request_type
  )
  values (
    normalized_name,
    normalized_contact,
    'website',
    normalized_message,
    'novo',
    true,
    'privacy-v1',
    submission_time,
    'cart_order'
  )
  returning id into new_lead_id;

  insert into public.lead_items (
    lead_id,
    product_id,
    quantity,
    unit_catalogue_price_eur,
    product_name_snapshot,
    created_at
  )
  select
    new_lead_id,
    products.id,
    (item ->> 'quantity')::integer,
    products.catalogue_price_eur,
    products.name,
    submission_time
  from jsonb_array_elements(p_items) as entry(item)
  join public.products
    on products.id = (item ->> 'productId')::uuid
    and products.active
    and products.catalogue_price_eur is not null
    and products.currency = 'EUR';

  get diagnostics inserted_item_count = row_count;
  if inserted_item_count <> expected_item_count then
    raise exception using errcode = '22023', message = 'invalid_cart_product';
  end if;

  insert into private.lead_submission_receipts (
    idempotency_key, request_hash, lead_id, created_at
  )
  values (
    p_idempotency_key, calculated_request_hash, new_lead_id, submission_time
  );

  return true;
end;
$$;

revoke execute on function public.submit_cart_lead(text, text, boolean, text, uuid, jsonb, text)
  from public, anon, authenticated;
grant execute on function public.submit_cart_lead(text, text, boolean, text, uuid, jsonb, text)
  to anon;
