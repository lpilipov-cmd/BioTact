import Link from "next/link";

export function StorefrontCTA({ cataloguePath }: Readonly<{ cataloguePath: string }>) {
  return <section className="storefront-cta" aria-labelledby="storefront-cta-heading"><p className="storefront-kicker storefront-kicker-light">Lična podrška</p><h2 id="storefront-cta-heading">Treba ti pomoć pri izboru?</h2><p>Pregledaj proverene informacije ili nam pošalji upit. Bez korpe, pritiska i nerealnih obećanja.</p><div><Link href={cataloguePath} className="button-gold">Pogledaj proizvode</Link><Link href="/kontakt" className="button-outline-light">Kontaktiraj nas</Link></div></section>;
}
