create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  article_number text not null unique,
  catalogue_source_code text,
  name text not null,
  category text not null,
  subcategory text,
  short_description text,
  package_content text,
  catalogue_price_eur numeric(10,2),
  currency text not null default 'EUR',
  price_valid_from date,
  image_path text,
  image_source_url text,
  product_source_url text,
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_slug_format_check check (
    slug = lower(btrim(slug))
    and char_length(slug) between 1 and 120
    and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint products_article_number_check check (
    article_number = btrim(article_number)
    and char_length(article_number) between 1 and 40
    and article_number ~ '^[A-Za-z0-9][A-Za-z0-9._-]*$'
  ),
  constraint products_catalogue_source_code_check check (
    catalogue_source_code is null
    or (catalogue_source_code = btrim(catalogue_source_code) and char_length(catalogue_source_code) between 1 and 80)
  ),
  constraint products_name_length_check check (char_length(btrim(name)) between 1 and 160),
  constraint products_category_check check (category in ('zdravlje', 'kozmetika', 'mirisi')),
  constraint products_subcategory_length_check check (subcategory is null or char_length(btrim(subcategory)) between 1 and 100),
  constraint products_description_length_check check (short_description is null or char_length(btrim(short_description)) between 1 and 2000),
  constraint products_package_content_length_check check (package_content is null or char_length(btrim(package_content)) between 1 and 120),
  constraint products_catalogue_price_check check (catalogue_price_eur is null or catalogue_price_eur >= 0),
  constraint products_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint products_image_path_check check (image_path is null or (char_length(image_path) between 1 and 500 and image_path like '/products/%')),
  constraint products_image_source_url_check check (image_source_url is null or char_length(image_source_url) between 1 and 2000),
  constraint products_product_source_url_check check (product_source_url is null or char_length(product_source_url) between 1 and 2000),
  constraint products_sort_order_check check (sort_order >= 0)
);

create table private.product_commercial_data (
  product_id uuid primary key references public.products(id) on delete cascade,
  partner_price_eur numeric(10,2),
  points numeric(10,2),
  source_price_valid_from date,
  updated_at timestamptz not null default now(),

  constraint product_commercial_partner_price_check check (partner_price_eur is null or partner_price_eur >= 0),
  constraint product_commercial_points_check check (points is null or points >= 0)
);

create table public.package_products (
  package_id uuid not null references public.packages(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  sort_order integer not null default 0,
  primary key (package_id, product_id),

  constraint package_products_quantity_check check (quantity > 0),
  constraint package_products_sort_order_check check (sort_order >= 0)
);

alter table public.leads
  add column product_interest_id uuid references public.products(id) on delete set null;

create index products_public_listing_idx on public.products (active, category, subcategory, sort_order, name);
create index package_products_product_id_idx on public.package_products (product_id);
create index leads_product_interest_id_idx on public.leads (product_interest_id);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger product_commercial_data_set_updated_at
before update on private.product_commercial_data
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.package_products enable row level security;
alter table private.product_commercial_data enable row level security;

revoke all on table public.products from public, anon, authenticated;
revoke all on table public.package_products from public, anon, authenticated;
revoke all on table private.product_commercial_data from public, anon, authenticated;

grant select on table public.products to anon;
grant select on table public.package_products to anon;
grant select, insert, update on table public.products to authenticated;
grant select, insert, update on table public.package_products to authenticated;
grant select, insert, update on table private.product_commercial_data to authenticated;

create policy "anon can read active products"
on public.products for select to anon
using (active);

create policy "administrators can read products"
on public.products for select to authenticated
using ((select private.is_admin()));

create policy "administrators can create products"
on public.products for insert to authenticated
with check ((select private.is_admin()));

create policy "administrators can update products"
on public.products for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "anon can read active package product relationships"
on public.package_products for select to anon
using (
  exists (select 1 from public.products where products.id = product_id and products.active)
  and exists (select 1 from public.packages where packages.id = package_id and packages.active)
);

create policy "administrators can read package product relationships"
on public.package_products for select to authenticated
using ((select private.is_admin()));

create policy "administrators can create package product relationships"
on public.package_products for insert to authenticated
with check ((select private.is_admin()));

create policy "administrators can update package product relationships"
on public.package_products for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "administrators can read product commercial data"
on private.product_commercial_data for select to authenticated
using ((select private.is_admin()));

create policy "administrators can create product commercial data"
on private.product_commercial_data for insert to authenticated
with check ((select private.is_admin()));

create policy "administrators can update product commercial data"
on private.product_commercial_data for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create function public.submit_product_lead(
  p_name text,
  p_contact text,
  p_consent_given boolean,
  p_ip_hash text,
  p_idempotency_key uuid,
  p_package_interest_id uuid default null,
  p_product_interest_id uuid default null,
  p_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted boolean;
  submitted_lead_id uuid;
begin
  if p_product_interest_id is not null and not exists (
    select 1 from public.products
    where id = p_product_interest_id and active
  ) then
    raise exception using errcode = '22023', message = 'invalid_product_interest';
  end if;

  if p_package_interest_id is not null and p_product_interest_id is not null then
    raise exception using errcode = '22023', message = 'multiple_interests_not_allowed';
  end if;

  inserted := public.submit_lead(
    p_name,
    p_contact,
    p_consent_given,
    p_ip_hash,
    p_idempotency_key,
    p_package_interest_id,
    p_message
  );

  if inserted and p_product_interest_id is not null then
    select lead_id into submitted_lead_id
    from private.lead_submission_receipts
    where idempotency_key = p_idempotency_key;

    update public.leads
    set product_interest_id = p_product_interest_id
    where id = submitted_lead_id;
  end if;

  return inserted;
end;
$$;

revoke execute on function public.submit_product_lead(text, text, boolean, text, uuid, uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.submit_product_lead(text, text, boolean, text, uuid, uuid, uuid, text)
  to anon;

comment on column public.packages.product_codes is
  'Temporary backwards-compatibility field. New catalogue relationships use public.package_products; remove only in a reviewed future migration.';
