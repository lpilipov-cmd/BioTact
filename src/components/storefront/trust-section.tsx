const values = [
  ["Jasno organizovan portfolio", "Kolekcije, proizvodi i paketi predstavljeni su pregledno."],
  ["Proverene informacije", "Objavljujemo informacije tek nakon provere dostupnih izvora."],
  ["Transparentan pregled proizvoda", "Sadržaj pakovanja i kataloška cena prikazani su kada su potvrđeni."],
  ["Lična podrška", "Upit vodi do razgovora sa osobom, bez automatskog checkout procesa."],
] as const;

export function TrustSection() {
  return <section className="storefront-trust" aria-labelledby="trust-heading"><div className="storefront-trust-heading"><p className="storefront-kicker">Poverenje kroz jasnoću</p><h2 id="trust-heading">Zašto BIOTACT?</h2><p>BIOTACT predstavlja proizvode iz LR Health & Beauty portfolija. BIOTACT nije proizvođač prikazanih LR proizvoda.</p></div><div className="storefront-trust-grid">{values.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
