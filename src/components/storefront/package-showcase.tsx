import Link from "next/link";

import { PackageCard } from "@/components/public/package-card";
import { getApprovedPackagePresentation } from "@/lib/packages/presentation";

import type { StorefrontPackage } from "./storefront-types";

export function PackageShowcase({ packages, productDetailBasePath = "/proizvodi" }: Readonly<{ packages: readonly StorefrontPackage[]; productDetailBasePath?: string }>) {
  const visiblePackages = packages.flatMap((item) => {
    const presentation = getApprovedPackagePresentation(item.slug);
    if (!presentation) return [];
    const productsByArticle = new Map(item.products.map((product) => [product.article_number, product]));
    return [{
      ...presentation,
      priceRsd: item.price_rsd,
      products: presentation.products.map((product) => {
        const current = productsByArticle.get(product.articleNumber);
        return current ? {
          ...product,
          slug: current.slug,
          name: current.name,
          packageContent: current.package_content ?? product.packageContent,
          imagePath: current.image_path ?? product.imagePath,
          cataloguePriceEur: current.catalogue_price_eur,
        } : product;
      }),
      linkedProductSlugs: new Set(item.products.map((product) => product.slug)),
    }];
  }).slice(0, 4);

  return (
    <section className="storefront-package-section" aria-labelledby="package-showcase-heading">
      <div className="storefront-package-intro"><div><p className="storefront-kicker storefront-kicker-light">BIOTACT paketi</p><h2 id="package-showcase-heading">Lakši način da izabereš.</h2></div><div><p>BIOTACT paketi kombinuju odabrane proizvode u jasne wellness rutine.</p><Link href="/paketi" className="button-gold">Pogledaj sve pakete</Link></div></div>
      <div className="storefront-package-grid">
        {visiblePackages.length ? visiblePackages.map((item, index) => (
          <PackageCard packageData={item} linkedProductSlugs={item.linkedProductSlugs} productDetailBasePath={productDetailBasePath} priority={index < 2} testId="featured-package-card" key={item.slug} />
        )) : <div className="storefront-package-empty"><h3>Paketi će uskoro biti dostupni.</h3><p>Objavićemo samo proverene sastave i informacije.</p></div>}
      </div>
    </section>
  );
}
