import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// @ts-expect-error Node's runtime TypeScript stripping requires the explicit extension.
import { parseSerbianDecimal, parseSerbianHealthRows, reconcileRows, type RawPriceRow } from "./lib/lr-health-price-list.ts";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node --experimental-strip-types scripts/generate-health-product-review.ts <price-list.html>");

const sourceUrl = "https://onboarding.lr-world.info/cenovnik.html";
const retrievalDate = "2026-08-07";
const priceValidFrom = "2026-04-19";
const html = readFileSync(sourcePath, "utf8");
const rows = parseSerbianHealthRows(html);
const reconciliation = reconcileRows(rows);

const normalizePackageContent = (value: string) => value
  .replace(/\bkapszula\b/g, "kapsula")
  .replace(/\btabletta\b/g, "tableta")
  .replace(/\bszelet\b/g, "pločica") || null;

const descriptions: Record<string, string> = {
  "80700": "Tečni dodatak ishrani sa vitaminom C i medom.",
  "81000": "Tečni dodatak ishrani sa vitaminom C, cinkom i selenom.",
  "80750": "Tečni dodatak ishrani sa vitaminom C i ukusom breskve, bez dodatog šećera.",
  "80850": "Tečni dodatak ishrani sa vitaminima C i E, kolagenom, glukozamin sulfatom i hondroitin sulfatom.",
  "80800": "Tečni dodatak ishrani sa vitaminom C, medom i ekstraktom koprive.",
  "80102": "Dodatak ishrani sa mineralima i mikronutrijentima.",
  "81180": "Dodatak ishrani sa prebioticima, bakterijskim kulturama i postbioticima.",
  "80360": "Kapsule sa kolostrumom namenjene svakodnevnoj wellness rutini.",
  "81330": "Dodatak ishrani sa mineralima, vitaminom B6 i biljnim ekstraktima.",
  "80980": "Dodatak ishrani u prahu sa kofeinom, taurinom, aminokiselinama, vitaminima i mineralima.",
  "80338": "Dodatak ishrani sa ribljim uljem i omega-3 masnim kiselinama.",
  "80331": "Dodatak ishrani sa vitaminom C i sastojcima reišija.",
  "80950": "Dodatak ishrani sa vitaminima i mikronutrijentima.",
  "80940": "Dodatak ishrani sa vitaminima D i K, koenzimom Q10, kurkumom i ekstraktom belog čaja.",
  "80361": "Proizvod na bazi obezmašćenog i dekazeinizovanog kravljeg kolostruma.",
  "80325": "Dodatak ishrani sa ekstraktom Cistus Incanus, vitaminom C i cinkom.",
  "80190": "Dodatak ishrani sa vitaminima E i D, manganom, glukozaminom i hondroitin sulfatom.",
  "80630": "Proizvod sa visokim sadržajem vlakana namenjen dopuni svakodnevne ishrane.",
  "80205": "Biljna čajna mešavina sa zelenim čajem.",
  "80332": "Dodatak ishrani sa kalcijumom, vitaminom D i ekstraktom crvene deteline.",
  "81140": "Proizvod sa kolagen peptidima, hijaluronskom kiselinom, vitaminima i biljnim ekstraktima.",
  "81247": "Müsli sa ovsenim pahuljicama, malinom i komadićima čokolade koji može zameniti jedan obrok.",
  "81260": "Mesečno pakovanje koje kombinuje izbor LR FIGUACTIVE obroka i navedene LR LIFETAKT proizvode.",
  "81241": "Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.",
  "81250": "Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.",
  "81242": "Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.",
  "81240": "Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.",
  "81243": "Veganski šejk sa biljnim proteinima i vlaknima koji može zameniti jedan obrok.",
  "81251": "LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.",
  "81245": "LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.",
  "81246": "LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.",
  "81244": "LR FIGUACTIVE supa namenjena praktičnoj zameni jednog obroka.",
};

const exactCatalogueCodes: Record<string, string> = {
  "80750": "80750-50", "80850": "80850-680", "80800": "80800-50",
  "81180": "81180-99", "80338": "80338-699", "80331": "80331-50",
  "80950": "80950-50", "80361": "80361-50", "80325": "80325-50",
  "80190": "80190-50", "80205": "80205-650",
};

const cataloguePresent = new Set(["80700", "81000", "80750", "80850", "80800", "80102", "81180", "80360", "81330", "80980", "80338", "80331", "80950", "80940", "80361", "80325", "80190", "80550", "80630", "80205", "80332", "81140", "81247", "81260", "81241", "81250", "81242", "81240", "81243", "81251", "81245", "81246", "81244"]);
const familyOnly = new Set(["81255", "81249", "81248"]);
const sourceCodeConflict = new Set(["80700", "81000"]);
const normalizedNames: Record<string, string> = {
  "81260": "LR BODY MISSION mesečno pakovanje",
};

function subcategory(row: RawPriceRow) {
  const code = Number(row.articleNumber);
  if (row.sourceSection === "Aloe vera") return "Aloe Vera";
  if (row.articleNumber.startsWith("812")) return "LR FIGUACTIVE i Body Mission";
  if ([80900, 80935, 80980, 80950, 80940, 80945].includes(code)) return "Mind Master";
  if ([81180, 80630, 80205].includes(code)) return "Digestivna podrška";
  if ([80360, 80361, 80325, 81000, 81003].includes(code)) return "Imunitet i kolostrum";
  if ([80850, 80883, 80190, 80550].includes(code)) return "Pokret i snaga";
  if ([80800, 80823, 80338, 80331].includes(code)) return "Srce i cirkulacija";
  return "Wellness podrška";
}

const slugify = (value: string, articleNumber: string) => {
  const suffix = `-${articleNumber}`;
  const base = value.toLocaleLowerCase("sr-Latn").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "dj").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base.slice(0, 120 - suffix.length).replace(/-+$/g, "")}${suffix}`;
};
const occurrencesByCode = new Map<string, RawPriceRow[]>();
for (const row of rows) occurrencesByCode.set(row.articleNumber, [...(occurrencesByCode.get(row.articleNumber) ?? []), row]);

const snapshotRows = rows.map((row, index) => ({
  occurrence_index: index + 1,
  source_section: row.sourceSection,
  source_section_index: row.sourceSectionIndex,
  raw_source_row: {
    article_number: row.articleNumber,
    product_name: row.name,
    package_content: row.packageContent,
    points: row.points,
    partner_price: row.partnerPrice,
    catalogue_price: row.cataloguePrice,
  },
  normalized: {
    article_number: row.articleNumber,
    package_content: normalizePackageContent(row.packageContent),
    points: parseSerbianDecimal(row.points, "p"),
    partner_price_eur: parseSerbianDecimal(row.partnerPrice, " EUR"),
    catalogue_price_eur: parseSerbianDecimal(row.cataloguePrice, " EUR"),
  },
  duplicate_occurrence_count: occurrencesByCode.get(row.articleNumber)?.length ?? 1,
}));

const snapshot = {
  source_url: sourceUrl,
  retrieval_date: retrievalDate,
  price_list_valid_from: priceValidFrom,
  source_language: "sr-Latn",
  source_currency: "EUR",
  selection_rule: "Only data-panel-lang=sr, Aloe vera and Zdravlje sections before Kozmetika, with both prices in EUR.",
  source_row_count: rows.length,
  unique_article_number_count: reconciliation.uniqueArticleCount,
  rows: snapshotRows,
  duplicate_groups: reconciliation.collapsed.map((group) => ({ article_number: group.articleNumber, occurrence_count: group.occurrences.length, source_occurrences: group.occurrences.map((row) => ({ source_section: row.sourceSection, source_section_index: row.sourceSectionIndex })) })),
  conflicting_duplicate_groups: reconciliation.conflicts,
};

const products = reconciliation.canonical.map((row, index) => {
  const description = descriptions[row.articleNumber] ?? null;
  const catalogueMatchStatus = exactCatalogueCodes[row.articleNumber]
    ? "matched_exactly_to_pdf"
    : sourceCodeConflict.has(row.articleNumber)
      ? "pdf_source_code_conflict"
      : cataloguePresent.has(row.articleNumber)
        ? "matched_to_pdf_without_safe_source_code"
        : familyOnly.has(row.articleNumber)
          ? "pdf_family_only"
          : "price_list_only";
  const unresolved: string[] = [];
  if (sourceCodeConflict.has(row.articleNumber)) unresolved.push("PDF assigns 80700-50 inconsistently; no catalogue_source_code stored.");
  if (catalogueMatchStatus === "matched_to_pdf_without_safe_source_code") unresolved.push("PDF does not provide an unambiguous source code with matching variant and package content.");
  if (catalogueMatchStatus === "pdf_family_only") unresolved.push("PDF supports only the broader product family, not a uniquely coded variant description.");
  if (catalogueMatchStatus === "price_list_only") unresolved.push("Product is not clearly identified in the supplied PDF catalogue.");
  if (!description) unresolved.push("Short description remains null pending owner content review.");
  return {
    slug: slugify(normalizedNames[row.articleNumber] ?? row.name, row.articleNumber),
    article_number: row.articleNumber,
    catalogue_source_code: exactCatalogueCodes[row.articleNumber] ?? null,
    exact_serbian_source_name: row.name,
    normalized_public_name: normalizedNames[row.articleNumber] ?? row.name,
    category: "zdravlje",
    subcategory: subcategory(row),
    short_description: description,
    package_content: normalizePackageContent(row.packageContent),
    raw_package_content: row.packageContent || null,
    catalogue_price_eur: parseSerbianDecimal(row.cataloguePrice, " EUR"),
    partner_price_eur: parseSerbianDecimal(row.partnerPrice, " EUR"),
    points: parseSerbianDecimal(row.points, "p"),
    currency: "EUR",
    price_valid_from: priceValidFrom,
    active: false,
    sort_order: index + 1,
    source_occurrence_count: occurrencesByCode.get(row.articleNumber)?.length ?? 1,
    price_match_status: "exact_serbian_eur_source",
    catalogue_match_status: catalogueMatchStatus,
    content_status: description ? "catalogue_supported" : "needs_owner_review",
    unresolved_differences: unresolved,
  };
});

const review = {
  status: "owner_review_required_before_any_remote_import_or_activation",
  generated_from: { price_list: sourceUrl, catalogue: "KATALOG_LR_HEALTH_MISSION_2026.pdf" },
  totals: { source_rows: rows.length, unique_article_numbers: reconciliation.uniqueArticleCount, importable_inactive_products: products.length, blocked_conflicting_products: reconciliation.conflicts.length },
  products,
  blocked_products: reconciliation.conflicts,
};

const sqlText = (value: string | null) => value === null ? "null" : `'${value.replaceAll("'", "''")}'`;
const publicValues = products.map((product) => `  (${[
  product.slug, product.article_number, product.catalogue_source_code, product.normalized_public_name,
  product.category, product.subcategory, product.short_description, product.package_content,
].map(sqlText).join(", ")}, ${product.catalogue_price_eur}, 'EUR', '${priceValidFrom}', false, ${product.sort_order})`).join(",\n");
const commercialValues = products.map((product) => `  (${sqlText(product.article_number)}, ${product.partner_price_eur}, ${product.points}, '${priceValidFrom}')`).join(",\n");

const sql = `\\set ON_ERROR_STOP on

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
${publicValues}
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
${commercialValues}
)
insert into private.product_commercial_data (product_id, partner_price_eur, points, source_price_valid_from)
select products.id, commercial_values.partner_price_eur, commercial_values.points, commercial_values.source_price_valid_from::date
from commercial_values
join public.products using (article_number)
on conflict (product_id) do update set
  partner_price_eur = excluded.partner_price_eur,
  points = excluded.points,
  source_price_valid_from = excluded.source_price_valid_from;

commit;
`;

const normalizationCounts = rows.reduce<Record<string, number>>((counts, row) => {
  if (row.packageContent.includes("kapszula")) counts["kapszula → kapsula"] = (counts["kapszula → kapsula"] ?? 0) + 1;
  if (row.packageContent.includes("tabletta")) counts["tabletta → tableta"] = (counts["tabletta → tableta"] ?? 0) + 1;
  if (row.packageContent.includes("szelet")) counts["szelet → pločica"] = (counts["szelet → pločica"] ?? 0) + 1;
  return counts;
}, {});
const catalogueMatched = products.filter((product) => product.catalogue_match_status.startsWith("matched_exactly")).length;
const cataloguePresentCount = products.filter((product) => product.catalogue_match_status !== "price_list_only").length;
const rowsTable = products.map((product) => `| ${product.article_number} | ${product.normalized_public_name} | ${product.package_content ?? "—"} | ${product.catalogue_price_eur} | ${product.partner_price_eur} | ${product.points} | ${product.catalogue_source_code ?? "—"} | ${product.content_status} |`).join("\n");
const duplicateTable = reconciliation.collapsed.map((group) => `| ${group.articleNumber} | ${group.occurrences.length} | ${group.occurrences.map((row) => `${row.sourceSection} #${row.sourceSectionIndex}`).join(", ")} |`).join("\n");
const docs = `# LR Health proizvodi — usaglašavanje srpskog cenovnika

Status: **lokalni inactive skup pripremljen; vlasnička revizija je obavezna pre bilo kakvog udaljenog importa ili aktivacije**

Izvor preuzet: ${retrievalDate}

Cenovnik važi od: ${priceValidFrom}

## Metod izbora izvora

Parser bira isključivo HTML panel \`data-panel-lang="sr"\`, zatim sekcije \`Aloe vera\` i \`Zdravlje\`, i prekida pre prve sekcije \`Kozmetika\`. Red je prihvaćen samo kada su obe izvorne cene označene sa \`EUR\`. Mađarski panel, svi \`Ft\` redovi, kozmetika, mirisi i poslovni materijali su isključeni. Decimalni zarez je sačuvan u izvornom snapshotu, dok JSON i SQL koriste tačku bez računanja ili zaokruživanja.

## Rezime

- Srpskih izvornih redova: **${rows.length}**
- Jedinstvenih šifara artikla: **${reconciliation.uniqueArticleCount}**
- Bezbedno sažetih grupa duplikata: **${reconciliation.collapsed.length}** (${rows.length - reconciliation.uniqueArticleCount} dodatnih pojavljivanja)
- Konfliktnih duplikata: **${reconciliation.conflicts.length}**
- Proizvoda sa tačno potvrđenim PDF source kodom: **${catalogueMatched}**
- Proizvoda prisutnih bar na nivou proizvoda ili porodice u PDF-u: **${cataloguePresentCount}**
- Proizvoda prisutnih samo u cenovniku: **${products.length - cataloguePresentCount}**
- Finalni lokalni inactive import: **${products.length}**

## Normalizacija sadržaja pakovanja

Izvorni sadržaj ostaje neizmenjen u snapshotu. Odvojeno javno polje menja samo nedvosmislene mađarske jedinice:

${Object.entries(normalizationCounts).map(([decision, count]) => `- \`${decision}\`: ${count} izvornih pojavljivanja`).join("\n")}

Prazan sadržaj pakovanja ostaje \`null\`; ništa nije nagađano.

## Duplikati

| Šifra | Pojavljivanja | Izvorne sekcije |
| --- | ---: | --- |
${duplicateTable}

Svaka navedena grupa ima identične naziv, sadržaj, poene, partnersku cenu i katalošku cenu. Konfliktnih grupa nema. Budući konflikt blokira proizvod i isključuje ga iz importa.

## PDF katalog i sadržaj

\`catalogue_source_code\` je upisan samo kada PDF jasno potvrđuje isti proizvod/varijantu i pakovanje. Konflikt PDF koda \`80700-50\` nije prenet ni na artikal 80700 ni na 81000. Opisi su neutralno prepisani samo kada ih PDF podržava; inače ostaju \`null\` sa statusom \`needs_owner_review\`. Izbačene su tvrdnje o lečenju, prevenciji, garantovanom rezultatu, medicinskom detoksu i garantovanom mršavljenju.

## Pregled svih kandidata i tačnih cena

| Šifra | Javni naziv | Sadržaj | Kataloška EUR (javno) | Partnerska EUR (privatno) | Poeni (privatno) | PDF kod | Sadržaj |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
${rowsTable}

Partnerska cena i poeni pripadaju isključivo tabeli \`private.product_commercial_data\`; javna tabela i javne rute ih ne sadrže.

## Blokirani proizvodi

Nema konfliktnih duplikata u važećem srpskom EUR delu cenovnika. Nepotvrđeni PDF kod ili opis ne blokiraju kanonski cenovnički SKU, ali ostaju eksplicitno označeni i ne proizvode izmišljeni katalog kod ili opis. Svi proizvodi ostaju neaktivni.

## Pregled mapiranja postojećih BIOTACT paketa

| Paket | Kanonske šifre | Rezultat |
| --- | --- | --- |
| Imunitet Start | 80361, 80325 | Tačno mapiranje oba proizvoda |
| Creva & Energija | 81180, 80205 | Tačno mapiranje oba proizvoda |
| Pokret & Snaga | 80850, 80190 | Tačno mapiranje oba proizvoda |
| Srce & Cirkulacija | 80800, 80338, 80331 | Tačno mapiranje sva tri proizvoda |

Ovo je samo pregled. Nijedan red u \`packages\` ili \`package_products\` nije promenjen.

## Lokalni import

\`scripts/import-local-health-products.sql\` je transakcijski, idempotentan, nikada ne briše i uvek postavlja \`active = false\`. Zahteva eksplicitni PostgreSQL session guard \`biotact.local_import=2026-04-19-inactive-health-products\`. Skripta ne dodiruje leadove, administratore, pakete niti veze paketa. Njena primena na udaljenu bazu nije odobrena.

Lokalna provera 7. avgusta 2026: guard je odbio izvršenje bez eksplicitne session vrednosti; zatim je import uspešno izvršen dva puta. Rezultat je 50 jedinstvenih neaktivnih proizvoda i 50 privatnih komercijalnih redova, anonimna vidljivost je 0, administratorska vidljivost je 50, \`package_products\` je ostao prazan, a checksum postojećih sedam lokalnih package redova ostao je nepromenjen (\`6ae8e3a0c133c5c26bbcf395faa464d5\`).
`;

mkdirSync(resolve("data/sources"), { recursive: true });
writeFileSync(resolve("data/sources/lr-serbian-health-price-list-2026-04-19.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
writeFileSync(resolve("data/lr-health-products-review.json"), `${JSON.stringify(review, null, 2)}\n`);
writeFileSync(resolve("scripts/import-local-health-products.sql"), sql);
writeFileSync(resolve("docs/lr-health-product-reconciliation.md"), docs);
console.log(JSON.stringify(review.totals));
