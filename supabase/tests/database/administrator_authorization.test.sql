begin;

create extension if not exists pgtap with schema extensions;

select plan(29);

select has_table('public', 'admin_profiles', 'admin_profiles table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.admin_profiles'::regclass),
  'admin_profiles has RLS enabled'
);
select ok(
  not has_table_privilege('anon', 'public.admin_profiles', 'select'),
  'anonymous users cannot read admin profiles'
);
select ok(
  not has_function_privilege('anon', 'private.is_admin()', 'execute'),
  'anonymous users cannot execute the admin helper'
);
select ok(
  has_function_privilege('authenticated', 'private.is_admin()', 'execute'),
  'authenticated requests may execute the scoped admin helper'
);

select is(
  (select count(*)::integer from public.leads),
  4,
  'deterministic local-only seed contains four fictional leads'
);

delete from public.leads;

insert into public.packages (
  id, slug, name, category, description, product_codes, active, sort_order
)
values (
  '40000000-0000-4000-8000-000000000001',
  'neaktivan-admin-test',
  'Neaktivan admin test',
  'forma',
  'Neutralan opis za proveru administratorskog pristupa.',
  array['TEMP-ADMIN-TEST'],
  false,
  100
);

insert into public.leads (
  id, name, contact, channel, status, consent_given, consent_version, consented_at
)
values (
  '41000000-0000-4000-8000-000000000001',
  'Lokalni test',
  'test@example.invalid',
  'website',
  'novo',
  true,
  'test-v1',
  now()
);

set local role anon;

select is(
  (select count(*)::integer from public.packages where active),
  6,
  'existing anonymous active-package access still works'
);
select is(
  (select count(*)::integer from public.packages where not active),
  0,
  'anonymous users cannot read inactive packages'
);
select throws_ok(
  $$select * from public.leads$$,
  '42501',
  'permission denied for table leads',
  'anonymous users cannot read leads'
);
select lives_ok(
  $$select public.submit_lead(
    'Javni lokalni test',
    'javni@example.invalid',
    true,
    'test-v1'
  )$$,
  'existing public submit_lead behavior still works'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '30000000-0000-4000-8000-000000000002',
  true
);

select is(
  (select count(*)::integer from public.packages),
  0,
  'authenticated non-admin users cannot read packages'
);
select is(
  (select count(*)::integer from public.leads),
  0,
  'authenticated non-admin users cannot read leads'
);
select is(
  (select count(*)::integer from public.admin_profiles),
  0,
  'authenticated non-admin users cannot read an admin profile'
);
select throws_ok(
  $$insert into public.admin_profiles (user_id)
    values ('30000000-0000-4000-8000-000000000002')$$,
  '42501',
  'permission denied for table admin_profiles',
  'authenticated non-admin users cannot add themselves as administrators'
);
select throws_ok(
  $$insert into public.packages (
      slug, name, category, description, product_codes
    ) values (
      'neadmin-paket',
      'Neadmin paket',
      'forma',
      'Neutralan opis lokalnog testa.',
      array['TEMP-NON-ADMIN']
    )$$,
  '42501',
  null,
  'authenticated non-admin users cannot create packages'
);
select lives_ok(
  $$update public.packages
    set active = true
    where id = '40000000-0000-4000-8000-000000000001'$$,
  'non-admin package update is denied without leaking row existence'
);
select lives_ok(
  $$update public.leads
    set status = 'kontaktiran'
    where id = '41000000-0000-4000-8000-000000000001'$$,
  'non-admin lead update is denied without leaking row existence'
);

reset role;
select is(
  (select active from public.packages where id = '40000000-0000-4000-8000-000000000001'),
  false,
  'non-admin package update changed no rows'
);
select is(
  (select status from public.leads where id = '41000000-0000-4000-8000-000000000001'),
  'novo',
  'non-admin lead update changed no rows'
);
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '30000000-0000-4000-8000-000000000001',
  true
);

select is(
  (select count(*)::integer from public.admin_profiles),
  1,
  'administrator can read their own admin profile'
);
select is(
  (select count(*)::integer from public.packages),
  7,
  'administrator can read active and inactive packages'
);
select is(
  (select count(*)::integer from public.leads),
  2,
  'administrator can read all leads'
);
select lives_ok(
  $$update public.leads
    set status = 'kontaktiran'
    where id = '41000000-0000-4000-8000-000000000001'$$,
  'administrator can update lead status'
);
select is(
  (select status from public.leads where id = '41000000-0000-4000-8000-000000000001'),
  'kontaktiran',
  'lead status update is persisted'
);
select ok(
  not has_column_privilege('authenticated', 'public.leads', 'contact', 'update'),
  'authenticated role cannot update protected lead fields'
);
select ok(
  not has_table_privilege('authenticated', 'public.leads', 'delete'),
  'authenticated role cannot delete leads'
);
select lives_ok(
  $$insert into public.packages (
      slug, name, category, description, product_codes, active
    ) values (
      'admin-kreira-paket',
      'Admin kreira paket',
      'lepota',
      'Neutralan opis lokalnog testa.',
      array['TEMP-ADMIN-CREATE'],
      true
    )$$,
  'administrator can create packages'
);
select lives_ok(
  $$update public.packages
    set active = false
    where slug = 'admin-kreira-paket'$$,
  'administrator can update and deactivate packages'
);
select ok(
  not has_table_privilege('authenticated', 'public.packages', 'delete'),
  'authenticated role cannot delete packages'
);

select * from finish();
rollback;
