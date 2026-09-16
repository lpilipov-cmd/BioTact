import Link from "next/link";

export function StorefrontCTA() {
  return <section className="storefront-cta" aria-labelledby="storefront-cta-heading"><p className="storefront-kicker storefront-kicker-light">Sledeći korak</p><h2 id="storefront-cta-heading">Pronađi rutinu koja ti odgovara.</h2><p>Pregledaj portfolio ili nam se javi za ličnu podršku pri izboru.</p><div><Link href="/proizvodi" className="button-gold">Pogledaj proizvode</Link><Link href="/kontakt" className="button-outline-light">Kontaktiraj nas</Link></div></section>;
}
