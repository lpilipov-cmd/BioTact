export type RawPriceRow = Readonly<{
  articleNumber: string;
  name: string;
  packageContent: string;
  points: string;
  partnerPrice: string;
  cataloguePrice: string;
  sourceSection: string;
  sourceSectionIndex: number;
}>;

const decode = (value: string) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function parseSerbianHealthRows(html: string): RawPriceRow[] {
  const panelStart = html.indexOf('data-panel-lang="sr"');
  if (panelStart < 0) throw new Error("Serbian price-list panel was not found.");
  const panelEnd = html.indexOf('data-panel-lang="', panelStart + 20);
  const panel = html.slice(panelStart, panelEnd < 0 ? undefined : panelEnd);
  const sections = [...panel.matchAll(/<section class="pdf-section"[\s\S]*?<div class="section-title"><span>([\s\S]*?)<\/span><\/div>([\s\S]*?)<\/section>/g)];
  const rows: RawPriceRow[] = [];

  for (const [sectionIndex, section] of sections.entries()) {
    const title = decode(section[1]);
    if (title === "Kozmetika") break;
    if (title !== "Aloe vera" && title !== "Zdravlje") continue;

    for (const row of section[2].matchAll(/<tr class="price-row"[\s\S]*?<\/tr>/g)) {
      const cells = [...row[0].matchAll(/<td(?: class="[^"]*")?>([\s\S]*?)<\/td>/g)].map((match) => decode(match[1]));
      if (cells.length !== 6) continue;
      const [articleNumber, name, packageContent, points, partnerPrice, cataloguePrice] = cells;
      if (!/^\d+$/.test(articleNumber)) continue;
      if (!partnerPrice.endsWith(" EUR") || !cataloguePrice.endsWith(" EUR")) continue;
      rows.push({ articleNumber, name, packageContent, points, partnerPrice, cataloguePrice, sourceSection: title, sourceSectionIndex: sectionIndex + 1 });
    }
  }

  return rows;
}

export function parseSerbianDecimal(value: string, suffix: " EUR" | "p") {
  if (!value.endsWith(suffix)) throw new Error(`Unexpected numeric source value: ${value}`);
  const decimal = value.slice(0, -suffix.length).replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(decimal)) throw new Error(`Invalid Serbian decimal: ${value}`);
  return decimal;
}

const identityFields = ["name", "packageContent", "points", "partnerPrice", "cataloguePrice"] as const;

export function reconcileRows(rows: readonly RawPriceRow[]) {
  const groups = new Map<string, RawPriceRow[]>();
  for (const row of rows) groups.set(row.articleNumber, [...(groups.get(row.articleNumber) ?? []), row]);

  const canonical: RawPriceRow[] = [];
  const collapsed: Readonly<{ articleNumber: string; occurrences: RawPriceRow[] }>[] = [];
  const conflicts: Readonly<{ articleNumber: string; occurrences: RawPriceRow[]; differingFields: string[] }>[] = [];

  for (const [articleNumber, occurrences] of groups) {
    const first = occurrences[0];
    const differingFields = identityFields.filter((field) => occurrences.some((row) => row[field] !== first[field]));
    if (differingFields.length) {
      conflicts.push({ articleNumber, occurrences, differingFields });
      continue;
    }
    canonical.push(first);
    if (occurrences.length > 1) collapsed.push({ articleNumber, occurrences });
  }

  return { canonical, collapsed, conflicts, uniqueArticleCount: groups.size };
}
