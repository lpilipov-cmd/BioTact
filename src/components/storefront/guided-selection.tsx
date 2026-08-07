import Link from "next/link";

export function GuidedSelection({ cataloguePath }: Readonly<{ cataloguePath: string }>) {
  const paths = [
    ["Želim više energije", `${cataloguePath}?subcategory=${encodeURIComponent("Mind Master")}`],
    ["Fokus na svakodnevni wellness", `${cataloguePath}?subcategory=${encodeURIComponent("Wellness podrška")}`],
    ["Podrška aktivnom životu", `${cataloguePath}?subcategory=${encodeURIComponent("Pokret i snaga")}`],
    ["Želim da pogledam sve proizvode", cataloguePath],
  ] as const;
  return <section className="storefront-guided" aria-labelledby="guided-heading"><div><p className="storefront-kicker">Vođeni izbor</p><h2 id="guided-heading">Nisi siguran šta da izabereš?</h2><p>Izaberi smer koji ti je najbliži. Prikazaćemo relevantan deo kataloga, bez automatizovanih preporuka i zdravstvenih obećanja.</p></div><nav aria-label="Putevi za izbor proizvoda">{paths.map(([label, href], index) => <Link href={href} key={label}><span>0{index + 1}</span>{label}<strong aria-hidden="true">↗</strong></Link>)}</nav></section>;
}
