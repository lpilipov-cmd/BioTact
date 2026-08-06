# LR Health proizvodi — usaglašavanje srpskog cenovnika

Status: **lokalni inactive skup pripremljen; vlasnička revizija je obavezna pre bilo kakvog udaljenog importa ili aktivacije**

Izvor preuzet: 2026-08-07

Cenovnik važi od: 2026-04-19

## Metod izbora izvora

Parser bira isključivo HTML panel `data-panel-lang="sr"`, zatim sekcije `Aloe vera` i `Zdravlje`, i prekida pre prve sekcije `Kozmetika`. Red je prihvaćen samo kada su obe izvorne cene označene sa `EUR`. Mađarski panel, svi `Ft` redovi, kozmetika, mirisi i poslovni materijali su isključeni. Decimalni zarez je sačuvan u izvornom snapshotu, dok JSON i SQL koriste tačku bez računanja ili zaokruživanja.

## Rezime

- Srpskih izvornih redova: **67**
- Jedinstvenih šifara artikla: **50**
- Bezbedno sažetih grupa duplikata: **16** (17 dodatnih pojavljivanja)
- Konfliktnih duplikata: **0**
- Proizvoda sa tačno potvrđenim PDF source kodom: **11**
- Proizvoda prisutnih bar na nivou proizvoda ili porodice u PDF-u: **36**
- Proizvoda prisutnih samo u cenovniku: **14**
- Finalni lokalni inactive import: **50**

## Normalizacija sadržaja pakovanja

Izvorni sadržaj ostaje neizmenjen u snapshotu. Odvojeno javno polje menja samo nedvosmislene mađarske jedinice:

- `tabletta → tableta`: 3 izvornih pojavljivanja
- `kapszula → kapsula`: 11 izvornih pojavljivanja
- `szelet → pločica`: 2 izvornih pojavljivanja

Prazan sadržaj pakovanja ostaje `null`; ništa nije nagađano.

## Duplikati

| Šifra | Pojavljivanja | Izvorne sekcije |
| --- | ---: | --- |
| 81000 | 2 | Aloe vera #1, Zdravlje #5 |
| 81003 | 2 | Aloe vera #1, Zdravlje #5 |
| 80750 | 2 | Aloe vera #1, Zdravlje #9 |
| 80850 | 2 | Aloe vera #1, Zdravlje #5 |
| 80883 | 2 | Aloe vera #1, Zdravlje #5 |
| 80800 | 2 | Aloe vera #1, Zdravlje #3 |
| 80823 | 2 | Aloe vera #1, Zdravlje #3 |
| 80102 | 3 | Zdravlje #2, Zdravlje #4, Zdravlje #9 |
| 81180 | 2 | Zdravlje #2, Zdravlje #6 |
| 80360 | 2 | Zdravlje #2, Zdravlje #5 |
| 80900 | 2 | Zdravlje #3, Zdravlje #4 |
| 80935 | 2 | Zdravlje #3, Zdravlje #4 |
| 80338 | 2 | Zdravlje #3, Zdravlje #4 |
| 80550 | 2 | Zdravlje #5, Zdravlje #9 |
| 80630 | 2 | Zdravlje #6, Zdravlje #9 |
| 80205 | 2 | Zdravlje #6, Zdravlje #9 |

Svaka navedena grupa ima identične naziv, sadržaj, poene, partnersku cenu i katalošku cenu. Konfliktnih grupa nema. Budući konflikt blokira proizvod i isključuje ga iz importa.

## PDF katalog i sadržaj

`catalogue_source_code` je upisan samo kada PDF jasno potvrđuje isti proizvod/varijantu i pakovanje. Konflikt PDF koda `80700-50` nije prenet ni na artikal 80700 ni na 81000. Opisi su neutralno prepisani samo kada ih PDF podržava; inače ostaju `null` sa statusom `needs_owner_review`. Izbačene su tvrdnje o lečenju, prevenciji, garantovanom rezultatu, medicinskom detoksu i garantovanom mršavljenju.

## Pregled svih kandidata i tačnih cena

| Šifra | Javni naziv | Sadržaj | Kataloška EUR (javno) | Partnerska EUR (privatno) | Poeni (privatno) | PDF kod | Sadržaj |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| 80700 | Aloe vera napitak sa medom | 1000 ml | 57.88 | 41.34 | 38 | — | catalogue_supported |
| 80743 | Aloe vera napitak sa medom pakovanje od 3 | 3x1000 ml | 159.85 | 114.18 | 92 | — | needs_owner_review |
| 81000 | Aloe Vera Immune Plus gel za piće | 1000 ml | 63.55 | 45.40 | 42 | — | catalogue_supported |
| 81003 | Aloe Vera Immune Plus gel za piće pakovanje od 3 | 3x1000 ml | 174.78 | 124.84 | 104 | — | needs_owner_review |
| 80750 | Aloe vera napitak sa ukusom breskve | 1000 ml | 57.88 | 41.34 | 38 | 80750-50 | catalogue_supported |
| 80783 | Aloe vera napitak sa ukusom breskve pakovanje od 3 | 3x1000 ml | 159.85 | 114.18 | 92 | — | needs_owner_review |
| 80850 | Aloe vera Freedom napitak | 1000 ml | 63.55 | 45.40 | 42 | 80850-680 | catalogue_supported |
| 80883 | Aloe vera Freedom napitak pakovanje od 3 | 3x1000 ml | 174.78 | 124.84 | 104 | — | needs_owner_review |
| 80800 | Aloe vera Sivera napitak | 1000 ml | 63.55 | 45.40 | 42 | 80800-50 | catalogue_supported |
| 80823 | Aloe vera Sivera napitak pakovanje od 3 | 3x1000 ml | 174.78 | 124.84 | 104 | — | needs_owner_review |
| 81100 | Aloe vera Acai napitak | 1000 ml | 63.55 | 45.40 | 42 | — | needs_owner_review |
| 81103 | Aloe vera Acai napitak pakovanje od 3 | 3x1000 ml | 174.78 | 124.84 | 104 | — | needs_owner_review |
| 95213 | Turbokid mesečni set (Aloe vera napitak sa medom, Vita Active, Colostrum Liquid) | — | 133.70 | 95.49 | 73 | — | needs_owner_review |
| 96034 | Turbokid mesečni set (Aloe vera napitak sa ukusom breskve, Vita Active, Colostrum Liquid) | — | 133.70 | 95.49 | 73 | — | needs_owner_review |
| 80102 | Pro Balance tablete | 360 tableta | 48.51 | 34.66 | 38 | — | catalogue_supported |
| 81180 | Pro 12+ kapsule | 30 kapsula | 73.88 | 52.78 | 60 | 81180-99 | catalogue_supported |
| 80360 | Colostrum Compact kapsule | 60 kapsula | 84.15 | 60.12 | 63 | — | catalogue_supported |
| 81330 | Liver support kapsule | 30 kapsula | 46.84 | 33.46 | 42 | — | catalogue_supported |
| 80900 | Mind Master Green | 500 ml | 27.43 | 19.58 | 16 | — | needs_owner_review |
| 80935 | Mind Master pakovanje od 5 (po izboru - Green/Red) | 5x500 ml | 126.54 | 90.39 | 67 | — | needs_owner_review |
| 80980 | Mind Master Extreme | 14 tasak | 52.39 | 37.43 | 32 | — | catalogue_supported |
| 80338 | Super Omega 3 kapsule | 60 kapsula | 55.37 | 39.55 | 44 | 80338-699 | catalogue_supported |
| 80331 | Reishi Plus kapsule | 30 kapsula | 60.75 | 43.40 | 44 | 80331-50 | catalogue_supported |
| 80301 | Vita Active | 150 ml | 35.19 | 25.13 | 23 | — | needs_owner_review |
| 80950 | Mind Master Red | 500 ml | 27.43 | 19.58 | 16 | 80950-50 | catalogue_supported |
| 80940 | Mind Master Gold | 500 ml | 32.09 | 22.93 | 27 | — | catalogue_supported |
| 80945 | Mind Master Gold pakovanje od 5 | 5x500 ml | 147.43 | 105.31 | 111 | — | needs_owner_review |
| 80361 | Colostrum Liquid | 125 ml | 62.06 | 44.33 | 47 | 80361-50 | catalogue_supported |
| 80325 | Cistus Incanus kapsule | 60 kapsula | 60.75 | 43.40 | 44 | 80325-50 | catalogue_supported |
| 80190 | Active Freedom kapsule | 60 kapsula | 48.93 | 34.96 | 36 | 80190-50 | catalogue_supported |
| 80550 | Protein ital | 375 g | 62.06 | 44.33 | 48 | — | needs_owner_review |
| 80630 | Fiber Boost | 210 g | 42.24 | 30.18 | 27 | — | catalogue_supported |
| 80205 | Herbal Fasting dijetalna čajna mešavina | 250 g | 33.10 | 23.64 | 25 | 80205-650 | catalogue_supported |
| 80332 | Woman Phyto kapsule | 90 kapsula | 44.33 | 31.67 | 30 | — | catalogue_supported |
| 81140 | 5in1 Beauty Elixir | 30 tubus | 237.16 | 169.40 | 190 | — | catalogue_supported |
| 81170 | 5in1 Men´s Shot | 30 tubus | 237.16 | 169.40 | 190 | — | needs_owner_review |
| 81251 | FIGU ACTIVE slatki krompir supa | 488 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81245 | FIGU ACTIVE začinjena kari supa | 488 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81246 | FIGU ACTIVE ukusna supa od povrća | 488 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81244 | FIGU ACTIVE sočna supa od paradajza | 488 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81255 | FIGU ACTIVE ovsena kaša sa šumskim voćem | 450 g | 62.24 | 44.45 | 54 | — | needs_owner_review |
| 81247 | FIGU ACTIVE hrskavi musli sa malinom | 420 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81249 | Figu Active Berry Snack, kutija od 6 | 6 pločica | 41.16 | 29.40 | 36 | — | needs_owner_review |
| 81248 | Figu Active Almond Snack, kutija od 6 | 6 pločica | 41.16 | 29.40 | 36 | — | needs_owner_review |
| 81260 | LR BODY MISSION mesečno pakovanje | — | 408.93 | 292.09 | 300 | — | catalogue_supported |
| 81241 | FIGU ACTIVE voćni jagoda šejk | 496 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81250 | FIGU ACTIVE ukusna karamela šejk | 496 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81242 | FIGU ACTIVE kafa šejk | 496 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81240 | FIGU ACTIVE blaga vanila šejk | 496 g | 62.24 | 44.45 | 54 | — | catalogue_supported |
| 81243 | FIGU ACTIVE kremasta čokolada šejk | 496 g | 62.24 | 44.45 | 54 | — | catalogue_supported |

Partnerska cena i poeni pripadaju isključivo tabeli `private.product_commercial_data`; javna tabela i javne rute ih ne sadrže.

## Blokirani proizvodi

Nema konfliktnih duplikata u važećem srpskom EUR delu cenovnika. Nepotvrđeni PDF kod ili opis ne blokiraju kanonski cenovnički SKU, ali ostaju eksplicitno označeni i ne proizvode izmišljeni katalog kod ili opis. Svi proizvodi ostaju neaktivni.

## Pregled mapiranja postojećih BIOTACT paketa

| Paket | Kanonske šifre | Rezultat |
| --- | --- | --- |
| Imunitet Start | 80361, 80325 | Tačno mapiranje oba proizvoda |
| Creva & Energija | 81180, 80205 | Tačno mapiranje oba proizvoda |
| Pokret & Snaga | 80850, 80190 | Tačno mapiranje oba proizvoda |
| Srce & Cirkulacija | 80800, 80338, 80331 | Tačno mapiranje sva tri proizvoda |

Ovo je samo pregled. Nijedan red u `packages` ili `package_products` nije promenjen.

## Lokalni import

`scripts/import-local-health-products.sql` je transakcijski, idempotentan, nikada ne briše i uvek postavlja `active = false`. Zahteva eksplicitni PostgreSQL session guard `biotact.local_import=2026-04-19-inactive-health-products`. Skripta ne dodiruje leadove, administratore, pakete niti veze paketa. Njena primena na udaljenu bazu nije odobrena.

Lokalna provera 7. avgusta 2026: guard je odbio izvršenje bez eksplicitne session vrednosti; zatim je import uspešno izvršen dva puta. Rezultat je 50 jedinstvenih neaktivnih proizvoda i 50 privatnih komercijalnih redova, anonimna vidljivost je 0, administratorska vidljivost je 50, `package_products` je ostao prazan, a checksum postojećih sedam lokalnih package redova ostao je nepromenjen (`6ae8e3a0c133c5c26bbcf395faa464d5`).
