import Link from "next/link";

import { ProductCard } from "@/components/public/product-card";

import type { StorefrontProduct } from "./storefront-types";

export function FeaturedProducts({ products, cataloguePath, detailBasePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string; detailBasePath: string }>) {
  return (
    <section className="storefront-section" aria-labelledby="featured-products-heading">
      <div className="storefront-section-heading">
        <div><p className="storefront-kicker">Izdvojeno iz kataloga</p><h2 id="featured-products-heading">Proizvodi koje vredi upoznati.</h2></div>
        <Link href={cataloguePath} className="storefront-text-link">Pogledaj sve proizvode →</Link>
      </div>
      {products.length ? <div className="storefront-featured-grid">{products.slice(0, 6).map((product, index) => <ProductCard product={product} detailBasePath={detailBasePath} priority={index < 2} key={product.article_number} />)}</div> : (
        <div className="storefront-empty"><p className="storefront-kicker">Katalog u pripremi</p><h3>Objavljujemo samo proverene proizvode.</h3><p>Do tada možete pogledati BIOTACT pakete ili nam poslati opšti upit.</p></div>
      )}
    </section>
  );
}
