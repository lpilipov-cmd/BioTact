begin;

create extension if not exists pgtap with schema extensions;

select plan(28);

delete from public.leads;
delete from private.lead_submission_receipts;
delete from private.lead_rate_limits;

select has_table('private', 'lead_rate_limits', 'durable rate-limit table exists');
select has_table('private', 'lead_submission_receipts', 'idempotency receipt table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'private.lead_rate_limits'::regclass),
  'rate-limit table has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'private.lead_submission_receipts'::regclass),
  'receipt table has RLS enabled'
);
select ok(
  not exists (
    select 1 from information_schema.columns
    where table_schema = 'private'
      and table_name = 'lead_rate_limits'
      and column_name in ('ip', 'ip_address', 'raw_ip')
  ),
  'rate-limit storage has no raw IP column'
);
select ok(
  not has_table_privilege('anon', 'private.lead_rate_limits', 'select'),
  'anonymous users cannot read rate-limit records'
);
select ok(
  not has_table_privilege('anon', 'private.lead_submission_receipts', 'select'),
  'anonymous users cannot read idempotency records'
);
select ok(
  not has_function_privilege('anon', 'private.cleanup_lead_capture_records()', 'execute'),
  'anonymous users cannot run cleanup'
);

set local role anon;

select is(
  public.submit_lead(
    'Javni test',
    'javni.test@example.invalid',
    true,
    repeat('1', 64),
    '60000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Molim više informacija.'
  ),
  true,
  'first valid submission creates a lead'
);
select is(
  public.submit_lead(
    'Javni test',
    'javni.test@example.invalid',
    true,
    repeat('1', 64),
    '60000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Molim više informacija.'
  ),
  false,
  'identical retry is accepted without another insert'
);
select throws_ok(
  $$select public.submit_lead(
    'Promenjen test', 'javni.test@example.invalid', true, repeat('1', 64),
    '60000000-0000-4000-8000-000000000001'
  )$$,
  '22023',
  'idempotency_key_reused',
  'idempotency key cannot be reused for different data'
);
select throws_ok(
  $$select public.submit_lead(
    'Bez saglasnosti', '+381601111111', false, repeat('2', 64),
    '60000000-0000-4000-8000-000000000002'
  )$$,
  '22023',
  'consent_required',
  'consent is enforced in the database'
);
select throws_ok(
  $$select public.submit_lead(
    'Pogrešan hash', '+381601111112', true, '127.0.0.1',
    '60000000-0000-4000-8000-000000000003'
  )$$,
  '22023',
  'invalid_lead_submission',
  'raw IP-shaped rate key is rejected'
);
select throws_ok(
  $$select public.submit_lead(
    'Neaktivan paket', '+381601111113', true, repeat('3', 64),
    '60000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000007'
  )$$,
  '22023',
  'invalid_package_interest',
  'inactive package interest is rejected'
);

select lives_ok(
  $$select public.submit_lead('Limit jedan', '+381602000001', true, repeat('4', 64), '60000000-0000-4000-8000-000000000011')$$,
  'first accepted request in an IP window succeeds'
);
select lives_ok(
  $$select public.submit_lead('Limit dva', '+381602000002', true, repeat('4', 64), '60000000-0000-4000-8000-000000000012')$$,
  'second accepted request in an IP window succeeds'
);
select lives_ok(
  $$select public.submit_lead('Limit tri', '+381602000003', true, repeat('4', 64), '60000000-0000-4000-8000-000000000013')$$,
  'third accepted request in an IP window succeeds'
);
select lives_ok(
  $$select public.submit_lead('Limit četiri', '+381602000004', true, repeat('4', 64), '60000000-0000-4000-8000-000000000014')$$,
  'fourth accepted request in an IP window succeeds'
);
select lives_ok(
  $$select public.submit_lead('Limit pet', '+381602000005', true, repeat('4', 64), '60000000-0000-4000-8000-000000000015')$$,
  'fifth accepted request in an IP window succeeds'
);
select throws_ok(
  $$select public.submit_lead('Limit šest', '+381602000006', true, repeat('4', 64), '60000000-0000-4000-8000-000000000016')$$,
  'P0001',
  'rate_limit_exceeded',
  'sixth request in ten minutes is rejected atomically'
);

reset role;

select is((select count(*)::integer from public.leads), 6, 'only accepted unique submissions were inserted');
select is((select count(*)::integer from private.lead_submission_receipts), 6, 'one receipt exists per inserted lead');
select is((select accepted_count from private.lead_rate_limits where key_hash = repeat('1', 64)), 1, 'retry does not consume rate allowance');
select is((select accepted_count from private.lead_rate_limits where key_hash = repeat('4', 64)), 5, 'per-IP counter stops at five');
select is((select channel from public.leads where contact = 'javni.test@example.invalid'), 'website', 'server-controlled channel is website');
select is((select status from public.leads where contact = 'javni.test@example.invalid'), 'novo', 'new public lead status is novo');
select is((select consent_version from public.leads where contact = 'javni.test@example.invalid'), 'privacy-v1', 'server-controlled consent version is stored');
select ok((select consent_given and consented_at is not null from public.leads where contact = 'javni.test@example.invalid'), 'consent evidence is stored');

select * from finish();
rollback;
