const values = [
  ["Organizovan portfolio", "Kategorije i informacije složene su tako da izbor bude pregledniji."],
  ["Transparentne informacije", "Javno prikazujemo sadržaj pakovanja i važeću katalošku cenu kada je dostupna."],
  ["Lična podrška", "Upit vodi do razgovora sa osobom, ne do automatskog checkout procesa."],
  ["Jasno poreklo", "Proizvodi pripadaju LR Health & Beauty portfoliju; BIOTACT ih ne proizvodi."],
] as const;

export function TrustSection() {
  return <section className="storefront-trust" aria-labelledby="trust-heading"><div className="storefront-trust-heading"><p className="storefront-kicker">Zašto BIOTACT</p><h2 id="trust-heading">Više jasnoće. Manje buke.</h2><p>BIOTACT uređuje put do LR proizvoda kroz jednostavniju navigaciju, odgovoran sadržaj i lični kontakt.</p></div><div className="storefront-trust-grid">{values.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
