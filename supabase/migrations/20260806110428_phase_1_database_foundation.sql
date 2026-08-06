create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  product_codes text[] not null,
  price_rsd integer,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint packages_slug_format_check check (
    slug = lower(btrim(slug))
    and char_length(slug) between 1 and 100
    and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint packages_name_length_check check (
    char_length(btrim(name)) between 1 and 120
  ),
  constraint packages_category_check check (
    category in ('imunitet', 'digestija', 'forma', 'pokret', 'lepota', 'srce')
  ),
  constraint packages_description_length_check check (
    char_length(btrim(description)) between 1 and 2000
  ),
  constraint packages_product_codes_not_empty_check check (
    cardinality(product_codes) > 0
  ),
  constraint packages_price_rsd_positive_check check (
    price_rsd is null or price_rsd > 0
  ),
  constraint packages_sort_order_nonnegative_check check (sort_order >= 0)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  channel text not null default 'website',
  package_interest_id uuid references public.packages(id) on delete set null,
  message text,
  status text not null default 'novo',
  consent_given boolean not null,
  consent_version text not null,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint leads_name_length_check check (
    char_length(btrim(name)) between 1 and 100
  ),
  constraint leads_contact_length_check check (
    char_length(btrim(contact)) between 3 and 254
  ),
  constraint leads_channel_check check (
    channel in ('website', 'instagram', 'whatsapp', 'referral')
  ),
  constraint leads_message_length_check check (
    message is null or char_length(message) <= 2000
  ),
  constraint leads_status_check check (
    status in ('novo', 'kontaktiran', 'konvertovan', 'izgubljen')
  ),
  constraint leads_consent_version_length_check check (
    char_length(btrim(consent_version)) between 1 and 64
  ),
  constraint leads_consent_evidence_check check (
    (consent_given and consented_at is not null)
    or (not consent_given and consented_at is null)
  )
);

create index leads_package_interest_id_idx
  on public.leads (package_interest_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

create trigger packages_set_updated_at
before update on public.packages
for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.packages enable row level security;
alter table public.leads enable row level security;

revoke all on table public.packages from public, anon, authenticated;
revoke all on table public.leads from public, anon, authenticated;

grant select on table public.packages to anon;

create policy "anon can read active packages"
on public.packages
for select
to anon
using (active);

create or replace function public.submit_lead(
  p_name text,
  p_contact text,
  p_consent_given boolean,
  p_consent_version text,
  p_package_interest_id uuid default null,
  p_message text default null,
  p_channel text default 'website'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_lead_id uuid;
  normalized_name text := btrim(p_name);
  normalized_contact text := btrim(p_contact);
  normalized_consent_version text := btrim(p_consent_version);
  normalized_message text := nullif(btrim(p_message), '');
begin
  if normalized_name is null
    or char_length(normalized_name) not between 1 and 100 then
    raise exception using
      errcode = '22023',
      message = 'Name must contain between 1 and 100 characters.';
  end if;

  if normalized_contact is null
    or char_length(normalized_contact) not between 3 and 254 then
    raise exception using
      errcode = '22023',
      message = 'Contact must contain between 3 and 254 characters.';
  end if;

  if p_channel is null
    or p_channel not in ('website', 'instagram', 'whatsapp', 'referral') then
    raise exception using
      errcode = '22023',
      message = 'Invalid lead channel.';
  end if;

  if normalized_message is not null and char_length(normalized_message) > 2000 then
    raise exception using
      errcode = '22023',
      message = 'Message must not exceed 2000 characters.';
  end if;

  if p_consent_given is not true then
    raise exception using
      errcode = '22023',
      message = 'Consent is required.';
  end if;

  if normalized_consent_version is null
    or char_length(normalized_consent_version) not between 1 and 64 then
    raise exception using
      errcode = '22023',
      message = 'Consent version is required.';
  end if;

  insert into public.leads (
    name,
    contact,
    channel,
    package_interest_id,
    message,
    consent_given,
    consent_version,
    consented_at
  )
  values (
    normalized_name,
    normalized_contact,
    p_channel,
    p_package_interest_id,
    normalized_message,
    true,
    normalized_consent_version,
    clock_timestamp()
  )
  returning id into new_lead_id;

  return new_lead_id;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.submit_lead(text, text, boolean, text, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_lead(text, text, boolean, text, uuid, text, text)
  to anon;
