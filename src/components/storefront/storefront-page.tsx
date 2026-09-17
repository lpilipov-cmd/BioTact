import { CategoryGrid } from "./category-grid";
import { FeaturedProducts } from "./featured-products";
import { GuidedSelection } from "./guided-selection";
import { PackageShowcase } from "./package-showcase";
import { StorefrontCTA } from "./storefront-cta";
import { StorefrontHero } from "./storefront-hero";
import type { StorefrontPackage, StorefrontProduct } from "./storefront-types";
import { TrustSection } from "./trust-section";

export function StorefrontPage({ products, packages, cataloguePath = "/proizvodi", detailBasePath = "/proizvodi", preview = false }: Readonly<{ products: readonly StorefrontProduct[]; packages: readonly StorefrontPackage[]; cataloguePath?: string; detailBasePath?: string; preview?: boolean }>) {
  return <main id="glavni-sadrzaj" className="storefront-page">{preview ? <div className="storefront-preview-banner" role="status"><strong>Zaštićeni vlasnički pregled</strong><span>Prikaz sa svih 50 neaktivnih lokalnih proizvoda · nije javno dostupan</span></div> : null}<StorefrontHero products={products} cataloguePath={cataloguePath} /><section className="storefront-section storefront-collections-section" aria-labelledby="category-heading"><div className="storefront-section-heading"><div><p className="storefront-kicker">BIOTACT katalog</p><h2 id="category-heading">Istražite po kolekciji</h2></div><p>Osam jasnih ulaza u LR wellness portfolio.</p></div><CategoryGrid products={products} cataloguePath={cataloguePath} /></section><FeaturedProducts products={products} cataloguePath={cataloguePath} detailBasePath={detailBasePath} /><PackageShowcase packages={packages} productDetailBasePath={detailBasePath} /><GuidedSelection cataloguePath={cataloguePath} /><TrustSection /><StorefrontCTA /></main>;
}
