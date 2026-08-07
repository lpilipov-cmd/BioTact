\set ON_ERROR_STOP on

begin;

do $$
begin
  if current_setting('biotact.local_import', true) is distinct from '2026-04-19-inactive-health-products' then
    raise exception 'Local-only import guard failed. Set PGOPTIONS=-c biotact.local_import=2026-04-19-inactive-health-products only for the local Supabase database.';
  end if;
end;
$$;

insert into public.products (
  slug, article_number, catalogue_source_code, name, category, subcategory,
  short_description, package_content, catalogue_price_eur, currency,
  price_valid_from, active, sort_order
)
values
  ('aloe-vera-napitak-sa-medom-80700', '80700', null, 'Aloe vera napitak sa medom', 'zdravlje', 'Aloe Vera', 'Tečni dodatak ishrani sa vitaminom C i medom.', '1000 ml', 57.88, 'EUR', '2026-04-19', false, 1),
  ('aloe-vera-napitak-sa-medom-pakovanje-od-3-80743', '80743', null, 'Aloe vera napitak sa medom pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 159.85, 'EUR', '2026-04-19', false, 2),
  ('aloe-vera-immune-plus-gel-za-pice-81000', '81000', null, 'Aloe Vera Immune Plus gel za piće', 'zdravlje', 'Aloe Vera', 'Tečni dodatak ishrani sa vitaminom C, cinkom i selenom.', '1000 ml', 63.55, 'EUR', '2026-04-19', false, 3),
  ('aloe-vera-immune-plus-gel-za-pice-pakovanje-od-3-81003', '81003', null, 'Aloe Vera Immune Plus gel za piće pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 174.78, 'EUR', '2026-04-19', false, 4),
  ('aloe-vera-napitak-sa-ukusom-breskve-80750', '80750', '80750-50', 'Aloe vera napitak sa ukusom breskve', 'zdravlje', 'Aloe Vera', 'Tečni dodatak ishrani sa vitaminom C i ukusom breskve, bez dodatog šećera.', '1000 ml', 57.88, 'EUR', '2026-04-19', false, 5),
  ('aloe-vera-napitak-sa-ukusom-breskve-pakovanje-od-3-80783', '80783', null, 'Aloe vera napitak sa ukusom breskve pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 159.85, 'EUR', '2026-04-19', false, 6),
  ('aloe-vera-freedom-napitak-80850', '80850', '80850-680', 'Aloe vera Freedom napitak', 'zdravlje', 'Aloe Vera', 'Tečni dodatak ishrani sa vitaminima C i E, kolagenom, glukozamin sulfatom i hondroitin sulfatom.', '1000 ml', 63.55, 'EUR', '2026-04-19', false, 7),
  ('aloe-vera-freedom-napitak-pakovanje-od-3-80883', '80883', null, 'Aloe vera Freedom napitak pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 174.78, 'EUR', '2026-04-19', false, 8),
  ('aloe-vera-sivera-napitak-80800', '80800', '80800-50', 'Aloe vera Sivera napitak', 'zdravlje', 'Aloe Vera', 'Tečni dodatak ishrani sa vitaminom C, medom i ekstraktom koprive.', '1000 ml', 63.55, 'EUR', '2026-04-19', false, 9),
  ('aloe-vera-sivera-napitak-pakovanje-od-3-80823', '80823', null, 'Aloe vera Sivera napitak pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 174.78, 'EUR', '2026-04-19', false, 10),
  ('aloe-vera-acai-napitak-81100', '81100', null, 'Aloe vera Acai napitak', 'zdravlje', 'Aloe Vera', null, '1000 ml', 63.55, 'EUR', '2026-04-19', false, 11),
  ('aloe-vera-acai-napitak-pakovanje-od-3-81103', '81103', null, 'Aloe vera Acai napitak pakovanje od 3', 'zdravlje', 'Aloe Vera', null, '3x1000 ml', 174.78, 'EUR', '2026-04-19', false, 12),
  ('turbokid-mesecni-set-aloe-vera-napitak-sa-medom-vita-active-colostrum-liquid-95213', '95213', null, 'Turbokid mesečni set (Aloe vera napitak sa medom, Vita Active, Colostrum Liquid)', 'zdravlje', 'Aloe Vera', null, null, 133.70, 'EUR', '2026-04-19', false, 13),
  ('turbokid-mesecni-set-aloe-vera-napitak-sa-ukusom-breskve-vita-active-colostrum-liquid-96034', '96034', null, 'Turbokid mesečni set (Aloe vera napitak sa ukusom breskve, Vita Active, Colostrum Liquid)', 'zdravlje', 'Aloe Vera', null, null, 133.70, 'EUR', '2026-04-19', false, 14),
  ('pro-balance-tablete-80102', '80102', null, 'Pro Balance tablete', 'zdravlje', 'Wellness podrška', 'Dodatak ishrani sa mineralima i mikronutrijentima.', '360 tableta', 48.51, 'EUR', '2026-04-19', false, 15),
  ('pro-12-kapsule-81180', '81180', '81180-99', 'Pro 12+ kapsule', 'zdravlje', 'Digestivna podrška', 'Dodatak ishrani sa prebioticima, bakterijskim kulturama i postbioticima.', '30 kapsula', 73.88, 'EUR', '2026-04-19', false, 16),
  ('colostrum-compact-kapsule-80360', '80360', null, 'Colostrum Compact kapsule', 'zdravlje', 'Imunitet i kolostrum', 'Kapsule sa kolostrumom namenjene svakodnevnoj wellness rutini.', '60 kapsula', 84.15, 'EUR', '2026-04-19', false, 17),
  ('liver-support-kapsule-81330', '81330', null, 'Liver support kapsule', 'zdravlje', 'Wellness podrška', 'Dodatak ishrani sa mineralima, vitaminom B6 i biljnim ekstraktima.', '30 kapsula', 46.84, 'EUR', '2026-04-19', false, 18),
  ('mind-master-green-80900', '80900', null, 'Mind Master Green', 'zdravlje', 'Mind Master', null, '500 ml', 27.43, 'EUR', '2026-04-19', false, 19),
  ('mind-master-pakovanje-od-5-po-izboru-green-red-80935', '80935', null, 'Mind Master pakovanje od 5 (po izboru - Green/Red)', 'zdravlje', 'Mind Master', null, '5x500 ml', 126.54, 'EUR', '2026-04-19', false, 20),
  ('mind-master-extreme-80980', '80980', null, 'Mind Master Extreme', 'zdravlje', 'Mind Master', 'Dodatak ishrani u prahu sa kofeinom, taurinom, aminokiselinama, vitaminima i mineralima.', '14 tasak', 52.39, 'EUR', '2026-04-19', false, 21),
  ('super-omega-3-kapsule-80338', '80338', '80338-699', 'Super Omega 3 kapsule', 'zdravlje', 'Srce i cirkulacija', 'Dodatak ishrani sa ribljim uljem i omega-3 masnim kiselinama.', '60 kapsula', 55.37, 'EUR', '2026-04-19', false, 22),
  ('reishi-plus-kapsule-80331', '80331', '80331-50', 'Reishi Plus kapsule', 'zdravlje', 'Srce i cirkulacija', 'Dodatak ishrani sa vitaminom C i sastojcima reišija.', '30 kapsula', 60.75, 'EUR', '2026-04-19', false, 23),
  ('vita-active-80301', '80301', null, 'Vita Active', 'zdravlje', 'Wellness podrška', null, '150 ml', 35.19, 'EUR', '2026-04-19', false, 24),
  ('mind-master-red-80950', '80950', '80950-50', 'Mind Master Red', 'zdravlje', 'Mind Master', 'Dodatak ishrani sa vitaminima i mikronutrijentima.', '500 ml', 27.43, 'EUR', '2026-04-19', false, 25),
  ('mind-master-gold-80940', '80940', null, 'Mind Master Gold', 'zdravlje', 'Mind Master', 'Dodatak ishrani sa vitaminima D i K, koenzimom Q10, kurkumom i ekstraktom belog čaja.', '500 ml', 32.09, 'EUR', '2026-04-19', false, 26),
  ('mind-master-gold-pakovanje-od-5-80945', '80945', null, 'Mind Master Gold pakovanje od 5', 'zdravlje', 'Mind Master', null, '5x500 ml', 147.43, 'EUR', '2026-04-19', false, 27),
  ('colostrum-liquid-80361', '80361', '80361-50', 'Colostrum Liquid', 'zdravlje', 'Imunitet i kolostrum', 'Proizvod na bazi obezmašćenog i dekazeinizovanog kravljeg kolostruma.', '125 ml', 62.06, 'EUR', '2026-04-19', false, 28),
  ('cistus-incanus-kapsule-80325', '80325', '80325-50', 'Cistus Incanus kapsule', 'zdravlje', 'Imunitet i kolostrum', 'Dodatak ishrani sa ekstraktom Cistus Incanus, vitaminom C i cinkom.', '60 kapsula', 60.75, 'EUR', '2026-04-19', false, 29),
  ('active-freedom-kapsule-80190', '80190', '80190-50', 'Active Freedom kapsule', 'zdravlje', 'Pokret i snaga', 'Dodatak ishrani sa vitaminima E i D, manganom, glukozaminom i hondroitin sulfatom.', '60 kapsula', 48.93, 'EUR', '2026-04-19', false, 30),
  ('protein-ital-80550', '80550', null, 'Protein ital', 'zdravlje', 'Pokret i snaga', null, '375 g', 62.06, 'EUR', '2026-04-19', false, 31),
  ('fiber-boost-80630', '80630', null, 'Fiber Boost', 'zdravlje', 'Digestivna podrška', 'Proizvod sa visokim sadržajem vlakana namenjen dopuni svakodnevne ishrane.', '210 g', 42.24, 'EUR', '2026-04-19', false, 32),
  ('herbal-fasting-dijetalna-cajna-mesavina-80205', '80205', '80205-650', 'Herbal Fasting dijetalna čajna mešavina', 'zdravlje', 'Digestivna podrška', 'Biljna čajna mešavina sa zelenim čajem.', '250 g', 33.10, 'EUR', '2026-04-19', false, 33),
  ('woman-phyto-kapsule-80332', '80332', null, 'Woman Phyto kapsule', 'zdravlje', 'Wellness podrška', 'Dodatak ishrani sa kalcijumom, vitaminom D i ekstraktom crvene deteline.', '90 kapsula', 44.33, 'EUR', '2026-04-19', false, 34),
  ('5in1-beauty-elixir-81140', '81140', null, '5in1 Beauty Elixir', 'zdravlje', 'Wellness podrška', 'Proizvod sa kolagen peptidima, hijaluronskom kiselinom, vitaminima i biljnim ekstraktima.', '30 tubus', 237.16, 'EUR', '2026-04-19', false, 35),
  ('5in1-men-s-shot-81170', '81170', null, '5in1 Men´s Shot', 'zdravlje', 'Wellness podrška', null, '30 tubus', 237.16, 'EUR', '2026-04-19', false, 36),
  ('figu-active-slatki-krompir-supa-81251', '81251', null, 'FIGU ACTIVE slatki krompir supa', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.', '488 g', 62.24, 'EUR', '2026-04-19', false, 37),
  ('figu-active-zacinjena-kari-supa-81245', '81245', null, 'FIGU ACTIVE začinjena kari supa', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.', '488 g', 62.24, 'EUR', '2026-04-19', false, 38),
  ('figu-active-ukusna-supa-od-povrca-81246', '81246', null, 'FIGU ACTIVE ukusna supa od povrća', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.', '488 g', 62.24, 'EUR', '2026-04-19', false, 39),
  ('figu-active-socna-supa-od-paradajza-81244', '81244', null, 'FIGU ACTIVE sočna supa od paradajza', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.', '488 g', 62.24, 'EUR', '2026-04-19', false, 40),
  ('figu-active-ovsena-kasa-sa-sumskim-vocem-81255', '81255', null, 'FIGU ACTIVE ovsena kaša sa šumskim voćem', 'zdravlje', 'LR FIGUACTIVE i Body Mission', null, '450 g', 62.24, 'EUR', '2026-04-19', false, 41),
  ('figu-active-hrskavi-musli-sa-malinom-81247', '81247', null, 'FIGU ACTIVE hrskavi musli sa malinom', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Müsli sa ovsenim pahuljicama, malinom i komadićima čokolade koji može zameniti jedan obrok.', '420 g', 62.24, 'EUR', '2026-04-19', false, 42),
  ('figu-active-berry-snack-kutija-od-6-81249', '81249', null, 'Figu Active Berry Snack, kutija od 6', 'zdravlje', 'LR FIGUACTIVE i Body Mission', null, '6 pločica', 41.16, 'EUR', '2026-04-19', false, 43),
  ('figu-active-almond-snack-kutija-od-6-81248', '81248', null, 'Figu Active Almond Snack, kutija od 6', 'zdravlje', 'LR FIGUACTIVE i Body Mission', null, '6 pločica', 41.16, 'EUR', '2026-04-19', false, 44),
  ('lr-body-mission-mesecno-pakovanje-81260', '81260', null, 'LR BODY MISSION mesečno pakovanje', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Mesečno pakovanje koje kombinuje izbor LR FIGUACTIVE obroka i navedene LR LIFETAKT proizvode.', null, 408.93, 'EUR', '2026-04-19', false, 45),
  ('figu-active-vocni-jagoda-sejk-81241', '81241', null, 'FIGU ACTIVE voćni jagoda šejk', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.', '496 g', 62.24, 'EUR', '2026-04-19', false, 46),
  ('figu-active-ukusna-karamela-sejk-81250', '81250', null, 'FIGU ACTIVE ukusna karamela šejk', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.', '496 g', 62.24, 'EUR', '2026-04-19', false, 47),
  ('figu-active-kafa-sejk-81242', '81242', null, 'FIGU ACTIVE kafa šejk', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.', '496 g', 62.24, 'EUR', '2026-04-19', false, 48),
  ('figu-active-blaga-vanila-sejk-81240', '81240', null, 'FIGU ACTIVE blaga vanila šejk', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.', '496 g', 62.24, 'EUR', '2026-04-19', false, 49),
  ('figu-active-kremasta-cokolada-sejk-81243', '81243', null, 'FIGU ACTIVE kremasta čokolada šejk', 'zdravlje', 'LR FIGUACTIVE i Body Mission', 'Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.', '496 g', 62.24, 'EUR', '2026-04-19', false, 50)
on conflict (article_number) do update set
  slug = excluded.slug,
  catalogue_source_code = excluded.catalogue_source_code,
  name = excluded.name,
  category = excluded.category,
  subcategory = excluded.subcategory,
  short_description = excluded.short_description,
  package_content = excluded.package_content,
  catalogue_price_eur = excluded.catalogue_price_eur,
  currency = excluded.currency,
  price_valid_from = excluded.price_valid_from,
  active = false,
  sort_order = excluded.sort_order;

with commercial_values (article_number, partner_price_eur, points, source_price_valid_from) as (
  values
  ('80700', 41.34, 38, '2026-04-19'),
  ('80743', 114.18, 92, '2026-04-19'),
  ('81000', 45.40, 42, '2026-04-19'),
  ('81003', 124.84, 104, '2026-04-19'),
  ('80750', 41.34, 38, '2026-04-19'),
  ('80783', 114.18, 92, '2026-04-19'),
  ('80850', 45.40, 42, '2026-04-19'),
  ('80883', 124.84, 104, '2026-04-19'),
  ('80800', 45.40, 42, '2026-04-19'),
  ('80823', 124.84, 104, '2026-04-19'),
  ('81100', 45.40, 42, '2026-04-19'),
  ('81103', 124.84, 104, '2026-04-19'),
  ('95213', 95.49, 73, '2026-04-19'),
  ('96034', 95.49, 73, '2026-04-19'),
  ('80102', 34.66, 38, '2026-04-19'),
  ('81180', 52.78, 60, '2026-04-19'),
  ('80360', 60.12, 63, '2026-04-19'),
  ('81330', 33.46, 42, '2026-04-19'),
  ('80900', 19.58, 16, '2026-04-19'),
  ('80935', 90.39, 67, '2026-04-19'),
  ('80980', 37.43, 32, '2026-04-19'),
  ('80338', 39.55, 44, '2026-04-19'),
  ('80331', 43.40, 44, '2026-04-19'),
  ('80301', 25.13, 23, '2026-04-19'),
  ('80950', 19.58, 16, '2026-04-19'),
  ('80940', 22.93, 27, '2026-04-19'),
  ('80945', 105.31, 111, '2026-04-19'),
  ('80361', 44.33, 47, '2026-04-19'),
  ('80325', 43.40, 44, '2026-04-19'),
  ('80190', 34.96, 36, '2026-04-19'),
  ('80550', 44.33, 48, '2026-04-19'),
  ('80630', 30.18, 27, '2026-04-19'),
  ('80205', 23.64, 25, '2026-04-19'),
  ('80332', 31.67, 30, '2026-04-19'),
  ('81140', 169.40, 190, '2026-04-19'),
  ('81170', 169.40, 190, '2026-04-19'),
  ('81251', 44.45, 54, '2026-04-19'),
  ('81245', 44.45, 54, '2026-04-19'),
  ('81246', 44.45, 54, '2026-04-19'),
  ('81244', 44.45, 54, '2026-04-19'),
  ('81255', 44.45, 54, '2026-04-19'),
  ('81247', 44.45, 54, '2026-04-19'),
  ('81249', 29.40, 36, '2026-04-19'),
  ('81248', 29.40, 36, '2026-04-19'),
  ('81260', 292.09, 300, '2026-04-19'),
  ('81241', 44.45, 54, '2026-04-19'),
  ('81250', 44.45, 54, '2026-04-19'),
  ('81242', 44.45, 54, '2026-04-19'),
  ('81240', 44.45, 54, '2026-04-19'),
  ('81243', 44.45, 54, '2026-04-19')
)
insert into private.product_commercial_data (product_id, partner_price_eur, points, source_price_valid_from)
select products.id, commercial_values.partner_price_eur, commercial_values.points, commercial_values.source_price_valid_from::date
from commercial_values
join public.products using (article_number)
on conflict (product_id) do update set
  partner_price_eur = excluded.partner_price_eur,
  points = excluded.points,
  source_price_valid_from = excluded.source_price_valid_from;

with product_images (article_number, image_path, image_source_url, product_source_url) as (
  values
  ('80700', '/products/80700/product.webp', null, null),
  ('80750', '/products/80750/product.webp', null, null),
  ('81000', '/products/81000/product.webp', null, null),
  ('80800', '/products/80800/product.webp', null, null),
  ('80850', '/products/80850/product.webp', null, null),
  ('80102', '/products/80102/product.webp', null, null),
  ('81180', '/products/81180/product.webp', null, null),
  ('80630', '/products/80630/product.webp', null, null),
  ('80205', '/products/80205/product.webp', null, null),
  ('81330', '/products/81330/product.webp', null, null),
  ('80332', '/products/80332/product.webp', null, null),
  ('80338', '/products/80338/product.webp', null, null),
  ('80331', '/products/80331/product.webp', null, null),
  ('80361', '/products/80361/product.webp', null, null),
  ('80360', '/products/80360/product.webp', null, null),
  ('80325', '/products/80325/product.webp', null, null),
  ('80190', '/products/80190/product.webp', null, null),
  ('80550', '/products/80550/product.webp', null, null),
  ('80950', '/products/80950/product.webp', null, null),
  ('80940', '/products/80940/product.webp', null, null),
  ('80980', '/products/80980/product.webp', null, null),
  ('81247', '/products/81247/product.webp', null, null),
  ('81250', '/products/81250/product.webp', null, null),
  ('81251', '/products/81251/product.webp', null, null),
  ('81100', '/products/81100/product.webp', null, null),
  ('81255', '/products/81255/product.webp', null, null),
  ('81249', '/products/81249/product.webp', null, null),
  ('81248', '/products/81248/product.webp', null, null),
  ('81260', '/products/81260/product.webp', null, null),
  ('80301', '/products/80301/product.webp', 'https://srb.lr-world.info/assets/home/vita-active.webp', 'https://srb.lr-world.info/proizvod.html?id=health-vitaaktiv-vitaminok-immunerosito'),
  ('80900', '/products/80900/product.webp', 'https://srb.lr-world.info/assets/imported/mind-master-green.jpg', 'https://srb.lr-world.info/proizvod.html?id=health-mind-master-green'),
  ('81140', '/products/81140/product.webp', 'https://srb.lr-world.info/assets/5in1/beauty-elixir-shot.png', 'https://srb.lr-world.info/5in1-beauty-elixir.html'),
  ('81170', '/products/81170/product.webp', 'https://srb.lr-world.info/assets/5in1/men-shot.png', 'https://srb.lr-world.info/5in1-mens-shot.html'),
  ('81241', '/products/81241/product.webp', 'https://srb.lr-world.info/assets/imported/Fruity-Strawberry-Shake_1024x768px-7bb82961fe.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81242', '/products/81242/product.webp', 'https://srb.lr-world.info/assets/imported/BM_Rezept_Lovely-Coffee-Shake_1024x768px-5b59dd322e.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81240', '/products/81240/product.webp', 'https://srb.lr-world.info/assets/imported/Soft-Vanilla-Shake_1024x768px-5440de61b5.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81243', '/products/81243/product.webp', 'https://srb.lr-world.info/assets/imported/Smooth-Cocoa-Shake_1024x768px-f0837dfbfd.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81245', '/products/81245/product.webp', 'https://srb.lr-world.info/assets/imported/BM_Rezept_Spicy-Curry-Soup_1024x768px-b257601fbf.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81246', '/products/81246/product.webp', 'https://srb.lr-world.info/assets/imported/BM_Rezept_Yummi-Veggie-Soup_1024x768px-562054084e.jpg', 'https://srb.lr-world.info/body-mission.html'),
  ('81244', '/products/81244/product.webp', 'https://srb.lr-world.info/assets/imported/BM_Rezept_Juicy-Tomato-Soup_1024x768px-12a855bdd3.jpg', 'https://srb.lr-world.info/body-mission.html')
)
update public.products as products
set image_path = product_images.image_path,
    image_source_url = product_images.image_source_url,
    product_source_url = product_images.product_source_url
from product_images
where products.article_number = product_images.article_number;

commit;
