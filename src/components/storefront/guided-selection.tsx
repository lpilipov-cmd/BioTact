import Link from "next/link";

import type { ProductCollectionId } from "@/lib/products/collections";

function collectionHref(cataloguePath: string, collection: ProductCollectionId) {
  return `${cataloguePath}?subcategory=${encodeURIComponent(collection)}`;
}

export function getGuidedSelectionPaths(cataloguePath: string) {
  return [
    ["Želim više energije", collectionHref(cataloguePath, "energija-i-fokus")],
    ["Tražim jednostavnu dnevnu rutinu", collectionHref(cataloguePath, "aloe-vera")],
    ["Aktivan sam i treniram", collectionHref(cataloguePath, "pokret-i-aktivan-zivot")],
    ["Želim da pregledam sve", cataloguePath],
  ] as const;
}

export function GuidedSelection({ cataloguePath }: Readonly<{ cataloguePath: string }>) {
  const paths = getGuidedSelectionPaths(cataloguePath);
  return <section className="storefront-guided" aria-labelledby="guided-heading"><div><p className="storefront-kicker">Izaberi smer</p><h2 id="guided-heading">Nisi siguran odakle da počneš?</h2><p>Četiri jednostavna ulaza u postojeći katalog — bez automatizovanih preporuka.</p></div><nav aria-label="Putevi za izbor proizvoda">{paths.map(([label, href], index) => <Link href={href} key={label}><span>0{index + 1}</span><strong>{label}</strong><i aria-hidden="true">↗</i></Link>)}</nav></section>;
}
