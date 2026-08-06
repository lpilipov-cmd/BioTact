begin;

do $production_packages$
declare
  current_payload jsonb;
  expected_payload constant jsonb :=
    '[
      {
        "name": "Imunitet Start",
        "slug": "imunitet-start",
        "active": true,
        "category": "imunitet",
        "price_rsd": null,
        "sort_order": 1,
        "description": "Namenjen osobama koje žele podršku svakodnevnoj wellness rutini. Paket objedinjuje LR LIFETAKT Tečni Colostrum i Cistus Incanus Capsule iz kataloga.",
        "product_codes": ["80361-50", "80325-50"]
      },
      {
        "name": "Creva & Energija",
        "slug": "creva-energija",
        "active": true,
        "category": "digestija",
        "price_rsd": null,
        "sort_order": 2,
        "description": "Namenjen osobama koje žele jednostavnu podršku svakodnevnoj wellness rutini i ishrani. Paket objedinjuje PRO 12+ i LR LIFETAKT Herbal Fasting Tea.",
        "product_codes": ["81180-99", "80205-650"]
      },
      {
        "name": "Pokret & Snaga",
        "slug": "pokret-snaga",
        "active": true,
        "category": "pokret",
        "price_rsd": null,
        "sort_order": 3,
        "description": "Namenjen osobama koje žele podršku aktivnom načinu života. Paket objedinjuje Aloe Vera Drinking Gel Active Freedom i LR LIFETAKT Active Freedom Capsule.",
        "product_codes": ["80850-680", "80190-50"]
      },
      {
        "name": "Srce & Cirkulacija",
        "slug": "srce-cirkulacija",
        "active": true,
        "category": "srce",
        "price_rsd": null,
        "sort_order": 4,
        "description": "Namenjen osobama koje žele podršku svakodnevnoj wellness rutini usmerenoj na srce i cirkulaciju. Paket objedinjuje Aloe Vera Drinking Gel Intense Sivera, Super Omega Capsule i LR LIFETAKT Reishi Plus Capsules.",
        "product_codes": ["80800-50", "80338-699", "80331-50"]
      }
    ]'::jsonb;
begin
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name', name,
        'slug', slug,
        'active', active,
        'category', category,
        'price_rsd', price_rsd,
        'sort_order', sort_order,
        'description', description,
        'product_codes', to_jsonb(product_codes)
      ) order by sort_order, slug
    ),
    '[]'::jsonb
  )
  into current_payload
  from public.packages;

  if current_payload = '[]'::jsonb then
    insert into public.packages (
      name,
      slug,
      category,
      description,
      product_codes,
      price_rsd,
      active,
      sort_order
    )
    values
      (
        'Imunitet Start',
        'imunitet-start',
        'imunitet',
        'Namenjen osobama koje žele podršku svakodnevnoj wellness rutini. Paket objedinjuje LR LIFETAKT Tečni Colostrum i Cistus Incanus Capsule iz kataloga.',
        array['80361-50', '80325-50'],
        null,
        true,
        1
      ),
      (
        'Creva & Energija',
        'creva-energija',
        'digestija',
        'Namenjen osobama koje žele jednostavnu podršku svakodnevnoj wellness rutini i ishrani. Paket objedinjuje PRO 12+ i LR LIFETAKT Herbal Fasting Tea.',
        array['81180-99', '80205-650'],
        null,
        true,
        2
      ),
      (
        'Pokret & Snaga',
        'pokret-snaga',
        'pokret',
        'Namenjen osobama koje žele podršku aktivnom načinu života. Paket objedinjuje Aloe Vera Drinking Gel Active Freedom i LR LIFETAKT Active Freedom Capsule.',
        array['80850-680', '80190-50'],
        null,
        true,
        3
      ),
      (
        'Srce & Cirkulacija',
        'srce-cirkulacija',
        'srce',
        'Namenjen osobama koje žele podršku svakodnevnoj wellness rutini usmerenoj na srce i cirkulaciju. Paket objedinjuje Aloe Vera Drinking Gel Intense Sivera, Super Omega Capsule i LR LIFETAKT Reishi Plus Capsules.',
        array['80800-50', '80338-699', '80331-50'],
        null,
        true,
        4
      );
  elsif current_payload = expected_payload then
    raise notice 'Verified BIOTACT launch packages already match; no changes made.';
  else
    raise exception 'Production packages table is not empty or differs from the approved launch set; no changes made.';
  end if;
end
$production_packages$;

commit;
