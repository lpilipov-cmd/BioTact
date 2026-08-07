import Image from "next/image";
import Link from "next/link";

import type { StorefrontProduct } from "./storefront-types";

export function StorefrontHero({ products, cataloguePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string }>) {
  const visualProducts = products.filter((product) => product.image_path).slice(0, 3);

  return (
    <section className="storefront-hero" aria-labelledby="storefront-heading">
      <div className="storefront-hero-copy">
        <p className="storefront-kicker">Odabrani LR portfolio · BIOTACT podrška</p>
        <h1 id="storefront-heading">Pametniji izbor za svakodnevni wellness.</h1>
        <p className="storefront-lead">Pregledna selekcija proizvoda, proverene informacije i lična podrška kada želite sigurniji sledeći korak.</p>
        <div className="storefront-actions">
          <Link href={cataloguePath} className="button-primary">Pronađi proizvod</Link>
          <Link href="/paketi" className="button-secondary">Pogledaj pakete</Link>
        </div>
        <dl className="storefront-hero-facts">
          <div><dt>Portfolio</dt><dd>Pažljivo organizovan</dd></div>
          <div><dt>Informacije</dt><dd>Jasne i proverljive</dd></div>
          <div><dt>Poručivanje</dt><dd>Uz lični kontakt</dd></div>
        </dl>
      </div>
      <div className="storefront-hero-visual" aria-label="Izdvojeni LR proizvodi">
        <div className="storefront-hero-orbit" aria-hidden="true" />
        {visualProducts.length ? visualProducts.map((product, index) => (
          <div className={`storefront-hero-product storefront-hero-product-${index + 1}`} key={product.article_number}>
            <Image
              src={product.image_path!}
              alt={product.name}
              fill
              className="object-contain"
              sizes={index === 0 ? "(max-width: 768px) 58vw, 30vw" : "(max-width: 768px) 34vw, 17vw"}
              priority={index === 0}
            />
          </div>
        )) : (
          <div className="storefront-hero-placeholder">
            <span>BIOTACT</span>
            <p>Provereni proizvodi biće prikazani nakon objave.</p>
          </div>
        )}
        <p className="storefront-hero-caption">Priroda. Nauka. Poverenje.</p>
      </div>
    </section>
  );
}
