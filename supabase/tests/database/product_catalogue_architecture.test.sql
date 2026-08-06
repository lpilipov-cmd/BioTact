begin;

create extension if not exists pgtap with schema extensions;
select plan(24);

select has_table('public', 'products', 'products table exists');
select has_table('private', 'product_commercial_data', 'private commercial table exists');
select has_table('public', 'package_products', 'package relationship table exists');
select has_column('public', 'leads', 'product_interest_id', 'leads support product interest');
select ok((select relrowsecurity from pg_class where oid = 'public.products'::regclass), 'products RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'private.product_commercial_data'::regclass), 'commercial RLS enabled');
select ok(not has_table_privilege('anon', 'private.product_commercial_data', 'select'), 'anon cannot read commercial data');
select ok(not has_table_privilege('authenticated', 'public.products', 'delete'), 'products cannot be hard deleted through authenticated API');

insert into public.products (id, slug, article_number, name, category, catalogue_price_eur, active, sort_order)
values
  ('70000000-0000-4000-8000-000000000001', 'aktivan-test', 'TEST-001', 'Aktivan proizvod', 'zdravlje', 12.34, true, 1),
  ('70000000-0000-4000-8000-000000000002', 'neaktivan-test', 'TEST-002', 'Neaktivan proizvod', 'zdravlje', null, false, 2);
insert into private.product_commercial_data (product_id, partner_price_eur, points)
values ('70000000-0000-4000-8000-000000000001', 9.87, 4.50);

select is((select catalogue_price_eur::text from public.products where article_number = 'TEST-001'), '12.34', 'decimal EUR value is exact');
select throws_ok(
  $$insert into public.products (slug, article_number, name, category) values ('duplikat', 'TEST-001', 'Duplikat', 'zdravlje')$$,
  '23505', null, 'article numbers are unique'
);
select throws_ok(
  $$insert into public.products (slug, article_number, name, category, catalogue_price_eur) values ('negativna-cena', 'TEST-003', 'Cena', 'zdravlje', -1)$$,
  '23514', null, 'negative catalogue prices are rejected'
);
select throws_ok(
  $$insert into public.products (slug, article_number, name, category, currency) values ('valuta', 'TEST-004', 'Valuta', 'zdravlje', 'euro')$$,
  '23514', null, 'currency must use three uppercase letters'
);

set local role anon;
select is((select count(*)::integer from public.products), 1, 'anon sees only active products');
select is((select article_number from public.products), 'TEST-001', 'anon sees expected active product');
select throws_ok($$select * from private.product_commercial_data$$, '42501', 'permission denied for schema private', 'anon cannot access commercial schema');
select throws_ok(
  $$select public.submit_product_lead('Test', 'test@example.invalid', true, repeat('a',64), '71000000-0000-4000-8000-000000000001', null, '70000000-0000-4000-8000-000000000002', null)$$,
  '22023', 'invalid_product_interest', 'inactive product interest is rejected'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.products), 0, 'non-admin cannot read products');
select lives_ok($$update public.products set active = false where article_number = 'TEST-001'$$, 'non-admin update leaks no rows');

reset role;
select ok((select active from public.products where article_number = 'TEST-001'), 'non-admin changed no product');
set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.products), 2, 'administrator sees active and inactive products');
select is((select partner_price_eur::text from private.product_commercial_data), '9.87', 'administrator reads partner price');
select lives_ok($$update public.products set active = false where article_number = 'TEST-001'$$, 'administrator can deactivate product');
select lives_ok($$update private.product_commercial_data set points = 5.25 where product_id = '70000000-0000-4000-8000-000000000001'$$, 'administrator can update commercial data');
select is((select points::text from private.product_commercial_data), '5.25', 'commercial update persisted exactly');

select * from finish();
rollback;
