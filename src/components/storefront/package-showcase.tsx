import Image from "next/image";
import Link from "next/link";

import { formatPackagePrice } from "@/lib/packages/constants";

import type { StorefrontPackage } from "./storefront-types";

export function PackageShowcase({ packages }: Readonly<{ packages: readonly StorefrontPackage[] }>) {
  return (
    <section className="storefront-package-section" aria-labelledby="package-showcase-heading">
      <div className="storefront-package-intro"><p className="storefront-kicker storefront-kicker-light">BIOTACT paketi</p><h2 id="package-showcase-heading">Lakši put od izbora do razgovora.</h2><p>Proizvodi su pojedinačne LR stavke. BIOTACT paketi su pažljivo složene kombinacije koje olakšavaju početni izbor, bez automatske kupovine na sajtu.</p><Link href="/paketi" className="button-gold">Pogledaj sve pakete</Link></div>
      <div className="storefront-package-grid">
        {packages.length ? packages.slice(0, 4).map((item, index) => (
          <article className="storefront-package-card" data-testid="featured-package-card" key={item.slug}>
            <div className="storefront-package-visual">
              <span>0{index + 1}</span>
              {item.products.filter((product) => product.image_path).slice(0, 3).map((product) => <div className="storefront-package-product" key={product.article_number}><Image src={product.image_path!} alt={product.name} fill className="object-contain" sizes="9rem" /></div>)}
            </div>
            <div><p className="storefront-kicker">Kurirani izbor</p><h3>{item.name}</h3><p>{item.description}</p><strong>{formatPackagePrice(item.price_rsd)}</strong><Link href={`/paketi/${item.slug}`}>Pogledaj paket →</Link></div>
          </article>
        )) : <div className="storefront-package-empty"><h3>Paketi će uskoro biti dostupni.</h3><p>Objavićemo samo proverene sastave i informacije.</p></div>}
      </div>
    </section>
  );
}
