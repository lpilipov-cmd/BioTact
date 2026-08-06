begin;

create extension if not exists pgtap with schema extensions;

select plan(26);

select has_table('public', 'packages', 'packages table exists');
select has_table('public', 'leads', 'leads table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.packages'::regclass),
  'packages has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.leads'::regclass),
  'leads has RLS enabled'
);
select is(
  (select count(*)::integer from public.packages),
  7,
  'development seed contains six active and one inactive fictional package'
);
select is(
  (select count(distinct category)::integer from public.packages),
  6,
  'development seed covers every allowed category'
);

delete from public.leads;
delete from public.packages;

insert into public.packages (
  id, slug, name, category, description, product_codes, active, sort_order
)
values
  ('20000000-0000-4000-8000-000000000001', 'aktivan-test-paket', 'Aktivan test paket', 'forma', 'Neutralan opis aktivnog test paketa.', array['TEMP-TEST-ACTIVE'], true, 1),
  ('20000000-0000-4000-8000-000000000002', 'neaktivan-test-paket', 'Neaktivan test paket', 'pokret', 'Neutralan opis neaktivnog test paketa.', array['TEMP-TEST-INACTIVE'], false, 2);

set local role anon;

select is(
  (select count(*)::integer from public.packages),
  1,
  'anon can read active packages'
);
select is(
  (select count(*)::integer from public.packages where not active),
  0,
  'anon cannot read inactive packages'
);
select ok(
  not has_table_privilege('anon', 'public.leads', 'select'),
  'anon has no direct select privilege on leads'
);
select throws_ok(
  $$select * from public.leads$$,
  '42501',
  'permission denied for table leads',
  'direct anon lead reads are denied'
);
select lives_ok(
  $$select public.submit_lead(
    'Test korisnik',
    '+381601234567',
    true,
    'privacy-v1',
    '20000000-0000-4000-8000-000000000001',
    'Želim više informacija.',
    'website'
  )$$,
  'public lead function accepts a valid consented lead'
);
select throws_ok(
  $$select public.submit_lead('Bez saglasnosti', '+381601234568', false, 'privacy-v1')$$,
  '22023',
  'Consent is required.',
  'public lead function rejects missing consent'
);
select throws_ok(
  $$select public.submit_lead('Pogrešan kanal', '+381601234569', true, 'privacy-v1', null, null, 'email')$$,
  '22023',
  'Invalid lead channel.',
  'public lead function rejects an invalid channel'
);

reset role;

select is(
  (select count(*)::integer from public.leads),
  1,
  'only the valid public submission was inserted'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes)
    values ('invalid-category', 'Invalid', 'energija', 'Opis', array['TEMP-X'])$$,
  '23514', null, 'invalid package category fails'
);
select throws_ok(
  $$insert into public.leads (name, contact, channel, status, consent_given, consent_version, consented_at)
    values ('Status test', '+381601111111', 'website', 'zatvoren', true, 'v1', now())$$,
  '23514', null, 'invalid lead status fails'
);
select throws_ok(
  $$insert into public.leads (name, contact, channel, consent_given, consent_version, consented_at)
    values ('Kanal test', '+381602222222', 'email', true, 'v1', now())$$,
  '23514', null, 'invalid direct lead channel fails'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes, price_rsd)
    values ('negativna-cena', 'Cena test', 'forma', 'Opis', array['TEMP-X'], -1)$$,
  '23514', null, 'negative package price fails'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes)
    values ('Nije Normalizovan', 'Slug test', 'forma', 'Opis', array['TEMP-X'])$$,
  '23514', null, 'non-normalized slug fails'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes)
    values ('prazno-ime', '   ', 'forma', 'Opis', array['TEMP-X'])$$,
  '23514', null, 'blank package name fails'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes)
    values ('prazan-opis', 'Opis test', 'forma', '   ', array['TEMP-X'])$$,
  '23514', null, 'blank package description fails'
);
select throws_ok(
  $$insert into public.packages (slug, name, category, description, product_codes)
    values ('prazne-sifre', 'Šifre test', 'forma', 'Opis', array[]::text[])$$,
  '23514', null, 'empty product code array fails'
);

select pg_sleep(0.01);
update public.packages
set name = 'Ažuriran test paket'
where id = '20000000-0000-4000-8000-000000000001';

select ok(
  (select updated_at > created_at from public.packages where id = '20000000-0000-4000-8000-000000000001'),
  'updated_at changes after a package update'
);

delete from public.packages
where id = '20000000-0000-4000-8000-000000000001';

select is(
  (select package_interest_id from public.leads limit 1),
  null::uuid,
  'deleting a package preserves its leads and clears the foreign key'
);
select ok(
  has_function_privilege('anon', 'public.submit_lead(text,text,boolean,text,uuid,text,text)', 'execute'),
  'anon can execute the public submission function'
);
select ok(
  not has_function_privilege('authenticated', 'public.submit_lead(text,text,boolean,text,uuid,text,text)', 'execute'),
  'ordinary authenticated users cannot execute the submission function'
);

select * from finish();
rollback;
