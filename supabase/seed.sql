-- Development-only placeholders. Product names, descriptions, codes, and all
-- commercial data require owner verification before any production seed/import.
insert into public.packages (
  id,
  slug,
  name,
  category,
  description,
  product_codes,
  price_rsd,
  active,
  sort_order
)
values
  ('10000000-0000-4000-8000-000000000001', 'privremeni-imunitet', 'Privremeni paket - Imunitet', 'imunitet', 'Neutralni razvojni sadržaj za kategoriju imunitet. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-IMUNITET-001'], null, true, 10),
  ('10000000-0000-4000-8000-000000000002', 'privremeni-digestija', 'Privremeni paket - Digestija', 'digestija', 'Neutralni razvojni sadržaj za kategoriju digestija. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-DIGESTIJA-001'], null, true, 20),
  ('10000000-0000-4000-8000-000000000003', 'privremeni-forma', 'Privremeni paket - Forma', 'forma', 'Neutralni razvojni sadržaj za kategoriju forma. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-FORMA-001'], null, true, 30),
  ('10000000-0000-4000-8000-000000000004', 'privremeni-pokret', 'Privremeni paket - Pokret', 'pokret', 'Neutralni razvojni sadržaj za kategoriju pokret. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-POKRET-001'], null, true, 40),
  ('10000000-0000-4000-8000-000000000005', 'privremeni-lepota', 'Privremeni paket - Lepota', 'lepota', 'Neutralni razvojni sadržaj za kategoriju lepota. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-LEPOTA-001'], null, true, 50),
  ('10000000-0000-4000-8000-000000000006', 'privremeni-srce', 'Privremeni paket - Srce', 'srce', 'Neutralni razvojni sadržaj za kategoriju srce. Konačan naziv i opis zahtevaju potvrdu vlasnika.', array['TEMP-SRCE-001'], null, true, 60)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  product_codes = excluded.product_codes,
  price_rsd = excluded.price_rsd,
  active = excluded.active,
  sort_order = excluded.sort_order;

-- LOCAL DEVELOPMENT AND E2E TESTING ONLY.
-- These deterministic users must never be pushed to a remote project. Remote
-- schema deployment uses `supabase db push` without `--include-seed`.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'admin@biotact.local',
    extensions.crypt('Biotact-local-admin-2026!', extensions.gen_salt('bf')),
    '2026-01-01 00:00:00+00',
    '{"provider":"email","providers":["email"]}',
    '{}',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'korisnik@biotact.local',
    extensions.crypt('Biotact-local-user-2026!', extensions.gen_salt('bf')),
    '2026-01-01 00:00:00+00',
    '{"provider":"email","providers":["email"]}',
    '{}',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '',
    '',
    '',
    ''
  )
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = excluded.updated_at;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '31000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '{"sub":"30000000-0000-4000-8000-000000000001","email":"admin@biotact.local"}',
    'email',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00'
  ),
  (
    '31000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    '{"sub":"30000000-0000-4000-8000-000000000002","email":"korisnik@biotact.local"}',
    'email',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00'
  )
on conflict (id) do update set
  provider_id = excluded.provider_id,
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  provider = excluded.provider,
  updated_at = excluded.updated_at;

insert into public.admin_profiles (user_id, created_at)
values (
  '30000000-0000-4000-8000-000000000001',
  '2026-01-01 00:00:00+00'
)
on conflict (user_id) do nothing;

-- LOCAL DEVELOPMENT AND E2E TESTING ONLY. All identities and contacts below
-- are fictional and deterministic. This file is never included in remote push.
insert into public.leads (
  id,
  name,
  contact,
  channel,
  package_interest_id,
  message,
  status,
  consent_given,
  consent_version,
  consented_at,
  created_at,
  updated_at
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Test Osoba Jedan',
    '060 111 22 33',
    'website',
    '10000000-0000-4000-8000-000000000001',
    'Fiktivni lokalni upit za proveru administratorskog prikaza.',
    'novo',
    true,
    'local-test-v1',
    '2026-01-04 12:00:00+00',
    '2026-01-04 12:00:00+00',
    '2026-01-04 12:00:00+00'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Test Osoba Dva',
    'test.osoba.dva@example.invalid',
    'instagram',
    null,
    null,
    'kontaktiran',
    true,
    'local-test-v1',
    '2026-01-03 12:00:00+00',
    '2026-01-03 12:00:00+00',
    '2026-01-03 12:00:00+00'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Test Osoba Tri',
    '+49 151 00000000',
    'whatsapp',
    '10000000-0000-4000-8000-000000000003',
    'Još jedan potpuno fiktivan lokalni upit.',
    'konvertovan',
    true,
    'local-test-v1',
    '2026-01-02 12:00:00+00',
    '2026-01-02 12:00:00+00',
    '2026-01-02 12:00:00+00'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'Test Osoba Četiri',
    'kontakt nije dostupan',
    'referral',
    '10000000-0000-4000-8000-000000000005',
    'Fiktivan kontakt namenjen proveri bezbednog rezervnog prikaza.',
    'novo',
    true,
    'local-test-v1',
    '2026-01-01 12:00:00+00',
    '2026-01-01 12:00:00+00',
    '2026-01-01 12:00:00+00'
  )
on conflict (id) do update set
  name = excluded.name,
  contact = excluded.contact,
  channel = excluded.channel,
  package_interest_id = excluded.package_interest_id,
  message = excluded.message,
  status = excluded.status,
  consent_given = excluded.consent_given,
  consent_version = excluded.consent_version,
  consented_at = excluded.consented_at,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;
