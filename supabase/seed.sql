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
