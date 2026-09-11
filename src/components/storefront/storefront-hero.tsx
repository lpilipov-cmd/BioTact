import Image from "next/image";
import Link from "next/link";

import type { StorefrontProduct } from "./storefront-types";

export function StorefrontHero({ products, cataloguePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string }>) {
  const visualProducts = products
    .filter((product) => product.image_path)
    .filter((product, index, collection) => collection.findIndex((item) => item.image_path === product.image_path) === index)
    .slice(0, 4);

  return (
    <section className="storefront-hero" aria-labelledby="storefront-heading">
      <div className="storefront-hero-copy">
        <p className="storefront-kicker">Wellness, jednostavnije.</p>
        <h1 id="storefront-heading">Proizvodi za rutinu koja ima smisla.</h1>
        <p className="storefront-lead">Pregledaj pažljivo organizovan LR wellness portfolio i pronađi proizvode koji odgovaraju tvojoj svakodnevnoj rutini.</p>
        <div className="storefront-actions">
          <Link href={cataloguePath} className="button-primary">Pogledaj proizvode</Link>
          <Link href="/paketi" className="button-secondary">Istraži pakete</Link>
        </div>
        <p className="storefront-hero-note"><span aria-hidden="true" /> LR Health &amp; Beauty proizvodi · BIOTACT podrška pri izboru</p>
      </div>
      <div className="storefront-hero-visual" aria-label="Izdvojeni LR proizvodi">
        <div className="storefront-hero-monogram" aria-hidden="true">B</div>
        <div className="storefront-hero-floor" aria-hidden="true" />
        {visualProducts.length ? visualProducts.map((product, index) => (
          <div className={`storefront-hero-product storefront-hero-product-${index + 1}`} key={product.article_number}>
            <Image
              src={product.image_path!}
              alt={product.name}
              fill
              className="object-contain"
              sizes={index < 2 ? "(max-width: 768px) 42vw, 22vw" : "(max-width: 768px) 30vw, 14vw"}
              preload={index === 0}
            />
          </div>
        )) : (
          <div className="storefront-hero-placeholder">
            <span>BIOTACT</span>
            <p>Provereni proizvodi biće prikazani nakon objave.</p>
          </div>
        )}
        <p className="storefront-hero-caption"><span>BIOTACT selekcija</span><strong>Priroda. Nauka. Poverenje.</strong></p>
      </div>
    </section>
  );
}
