begin;

create extension if not exists pgtap with schema extensions;
select plan(27);

select has_table('public', 'lead_items', 'lead items table exists');
select has_column('public', 'leads', 'request_type', 'leads identify cart order requests');
select has_function('public', 'submit_cart_lead', array['text','text','boolean','text','uuid','jsonb','text'], 'cart order RPC exists');
select ok((select relrowsecurity from pg_class where oid = 'public.lead_items'::regclass), 'lead items RLS enabled');
select ok(not has_table_privilege('anon', 'public.lead_items', 'select'), 'anon cannot select lead items');
select ok(not has_table_privilege('anon', 'public.lead_items', 'insert'), 'anon cannot insert lead items directly');
select ok(has_function_privilege('anon', 'public.submit_cart_lead(text,text,boolean,text,uuid,jsonb,text)', 'execute'), 'anon can execute cart RPC');
select ok(not has_function_privilege('authenticated', 'public.submit_cart_lead(text,text,boolean,text,uuid,jsonb,text)', 'execute'), 'non-admin authenticated role cannot execute cart RPC');

insert into public.products (id, slug, article_number, name, category, catalogue_price_eur, currency, active, sort_order)
values
  ('72000000-0000-4000-8000-000000000001', 'cart-test-jedan', 'CART-001', 'Cart test jedan', 'zdravlje', 10.25, 'EUR', true, 1),
  ('72000000-0000-4000-8000-000000000002', 'cart-test-dva', 'CART-002', 'Cart test dva', 'zdravlje', 20.50, 'EUR', true, 2),
  ('72000000-0000-4000-8000-000000000003', 'cart-test-tri', 'CART-003', 'Cart test tri', 'zdravlje', 30.75, 'EUR', true, 3),
  ('72000000-0000-4000-8000-000000000004', 'cart-test-neaktivan', 'CART-004', 'Cart test neaktivan', 'zdravlje', 40.00, 'EUR', false, 4);

set local role anon;
select throws_ok(
  $$insert into public.lead_items (lead_id, product_id, quantity, unit_catalogue_price_eur, product_name_snapshot)
    values ('20000000-0000-4000-8000-000000000001', '72000000-0000-4000-8000-000000000001', 1, 0.01, 'Falsifikat')$$,
  '42501', 'permission denied for table lead_items', 'anon direct item insert is denied'
);

select ok(public.submit_cart_lead(
  'Cart Kupac Jedan', 'cart.one@example.invalid', true, repeat('7', 64),
  '73000000-0000-4000-8000-000000000001',
  '[{"productId":"72000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb,
  'Jedan proizvod'
), 'one-product cart creates a lead');

select is(public.submit_cart_lead(
  'Cart Kupac Jedan', 'cart.one@example.invalid', true, repeat('7', 64),
  '73000000-0000-4000-8000-000000000001',
  '[{"productId":"72000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb,
  'Jedan proizvod'
), false, 'idempotent retry does not create a duplicate');

select ok(public.submit_cart_lead(
  'Cart Kupac Tri', 'cart.three@example.invalid', true, repeat('8', 64),
  '73000000-0000-4000-8000-000000000002',
  '[{"productId":"72000000-0000-4000-8000-000000000001","quantity":1},{"productId":"72000000-0000-4000-8000-000000000002","quantity":3},{"productId":"72000000-0000-4000-8000-000000000003","quantity":2}]'::jsonb,
  null
), 'mixed cart creates one lead with three items');

select throws_ok(
  $$select public.submit_cart_lead(
    'Neaktivan', 'inactive@example.invalid', true, repeat('9', 64),
    '73000000-0000-4000-8000-000000000003',
    '[{"productId":"72000000-0000-4000-8000-000000000004","quantity":1}]'::jsonb,
    null
  )$$,
  '22023', 'invalid_cart_product', 'inactive products are rejected'
);

select throws_ok(
  $$select public.submit_cart_lead(
    'Prazno', 'empty@example.invalid', true, repeat('a', 64),
    '73000000-0000-4000-8000-000000000004', '[]'::jsonb, null
  )$$,
  '22023', 'invalid_cart_items', 'empty carts are rejected'
);

select throws_ok(
  $$select public.submit_cart_lead(
    'Cena', 'price@example.invalid', true, repeat('b', 64),
    '73000000-0000-4000-8000-000000000005',
    '[{"productId":"72000000-0000-4000-8000-000000000001","quantity":1,"priceEur":0.01}]'::jsonb,
    null
  )$$,
  '22023', 'invalid_cart_items', 'client prices are not accepted'
);

reset role;
select is((select count(*)::integer from public.leads where request_type = 'cart_order' and contact like 'cart.%@example.invalid'), 2, 'exactly two cart leads were created');
select is((select count(*)::integer from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.one@example.invalid')), 1, 'single-product lead has one item');
select is((select quantity from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.one@example.invalid')), 2, 'single-product quantity is preserved');
select is((select unit_catalogue_price_eur::text from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.one@example.invalid')), '10.25', 'public price snapshot comes from products');
select is((select product_name_snapshot from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.one@example.invalid')), 'Cart test jedan', 'name snapshot comes from products');
select is((select count(*)::integer from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.three@example.invalid')), 3, 'mixed cart has three items');
select is((select sum(quantity)::integer from public.lead_items where lead_id in (select id from public.leads where contact = 'cart.three@example.invalid')), 6, 'mixed quantities are preserved');
select is((select count(*)::integer from private.lead_submission_receipts where idempotency_key in ('73000000-0000-4000-8000-000000000001','73000000-0000-4000-8000-000000000002')), 2, 'one receipt exists per order lead');

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000002', true);
select is((select count(*)::integer from public.lead_items), 0, 'non-admin cannot read order items');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000001', true);
select is((select count(*)::integer from public.lead_items where lead_id in (select id from public.leads where request_type = 'cart_order' and contact like 'cart.%@example.invalid')), 4, 'administrator reads every order item');

reset role;
select ok(public.submit_product_lead(
  'Postojeći tok', 'legacy@example.invalid', true, repeat('c', 64),
  '73000000-0000-4000-8000-000000000006', null,
  '72000000-0000-4000-8000-000000000001', null
), 'existing product enquiry RPC still works');
select is((select request_type from public.leads where contact = 'legacy@example.invalid'), 'enquiry', 'existing enquiry keeps its default request type');

select * from finish();
rollback;
