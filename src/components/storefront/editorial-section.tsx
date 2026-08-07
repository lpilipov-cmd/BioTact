import Link from "next/link";

export function EditorialSection({ cataloguePath }: Readonly<{ cataloguePath: string }>) {
  const topics = [
    ["Aloe Vera", "Jedna od prepoznatljivih LR kategorija, predstavljena kroz proverene varijante i pakovanja.", "Aloe Vera"],
    ["Crevna flora", "Upoznajte proizvode svrstane u digestivnu podršku i njihove deklarisane formate.", "Digestivna podrška"],
    ["Energija i fokus", "Pregled funkcionalnih napitaka namenjenih dinamičnoj svakodnevici.", "Mind Master"],
    ["Body Mission", "Praktični LR FIGUACTIVE obroci i proizvodi organizovani na jednom mestu.", "LR FIGUACTIVE i Body Mission"],
  ] as const;
  return <section className="storefront-editorial" aria-labelledby="editorial-heading"><div className="storefront-section-heading"><div><p className="storefront-kicker">Istražite portfolio</p><h2 id="editorial-heading">Upoznaj kategorije pre izbora.</h2></div><p className="storefront-editorial-note">Kratki putevi ka relevantnim delovima kataloga. Edukativni sadržaj i blog dolaze kasnije.</p></div><div>{topics.map(([title, text, subcategory], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Link href={`${cataloguePath}?subcategory=${encodeURIComponent(subcategory)}`} aria-label={`Istraži kategoriju ${title}`}>→</Link></article>)}</div></section>;
}
