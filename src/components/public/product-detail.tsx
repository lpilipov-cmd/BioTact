import Link from "next/link";

import { AddToCart } from "@/components/cart/add-to-cart";
import { getProductCollection } from "@/lib/products/collections";
import { formatEurPrice } from "@/lib/products/format";
import { getProductPresentation } from "@/lib/products/presentation";

import type { CatalogueProduct } from "./product-catalogue";
import { ProductCard } from "./product-card";
import { ProductImage } from "./product-image";

type Product = CatalogueProduct & Readonly<{ id: string; article_number: string }>;
type RelatedPackage = Readonly<{ slug: string; name: string }>;

export function ProductDetail({
  product,
  relatedProducts,
  relatedPackages,
  cataloguePath = "/proizvodi",
  detailBasePath = "/proizvodi",
  preview = false,
}: Readonly<{
  product: Product;
  relatedProducts: readonly CatalogueProduct[];
  relatedPackages: readonly RelatedPackage[];
  cataloguePath?: string;
  detailBasePath?: string;
  preview?: boolean;
}>) {
  const presentation = getProductPresentation(product.article_number);
  const collection = getProductCollection(product.article_number);
  const packageContent = presentation.quantity ?? product.package_content ?? "Na upit";
  const productType = presentation.type === "multipack" ? "Multipack" : presentation.type === "set" ? "Set" : "Pojedinačni proizvod";

  return (
    <main id="glavni-sadrzaj" className="product-detail-shell">
      <Link href={cataloguePath} className="product-back-link">← Nazad na proizvode</Link>
      {preview ? <p className="mt-6 inline-flex rounded-full bg-[#17301f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f7f3ea]">Zaštićeni vlasnički pregled</p> : null}
      <article className="product-detail-hero">
        <div className="product-detail-image">
          <ProductImage
            imagePath={product.image_path}
            articleNumber={product.article_number}
            name={product.name}
            sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) 40rem, 36rem"
            preload
          />
        </div>
        <div className="product-detail-information">
          <p className="eyebrow">{collection.label}</p>
          <h1>{product.name}</h1>
          {product.short_description ? <p className="product-detail-intro">{product.short_description}</p> : null}
          <div className="product-detail-price-block">
            <span>Kataloška cena</span>
            <p className="product-detail-price">{formatEurPrice(product.catalogue_price_eur)}</p>
          </div>
          <div className="product-detail-package">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a6b45]">Sadržaj pakovanja</p>
            <p className="mt-2 font-semibold">{packageContent}</p>
          </div>
          {presentation.constituentNotice ? <p className="mt-5 rounded-2xl bg-[#eee5d2] p-4 text-sm leading-6 text-[#405548]">{presentation.constituentNotice}</p> : null}
          <div className="product-detail-next-step">
            {preview ? (
              <p>Ovo je zaštićeni pregled neaktivnog proizvoda. Dodavanje u javnu korpu nije omogućeno.</p>
            ) : product.catalogue_price_eur === null ? (
              <p>Cena proizvoda trenutno nije dostupna, pa ga nije moguće dodati u korpu.</p>
            ) : (
              <AddToCart
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceEur: product.catalogue_price_eur,
                  imagePath: product.image_path,
                }}
              />
            )}
            <Link href={`/kontakt?product=${encodeURIComponent(product.slug)}`} className="product-question-link">Imam pitanje o proizvodu</Link>
            <p>Dodajte proizvod u korpu i nastavite sa pregledom. Dostupnost i sledeće korake potvrđujemo nakon slanja porudžbine.</p>
          </div>
        </div>
      </article>
      <section className="product-detail-overview" aria-labelledby="product-overview-heading">
        <div>
          <p className="eyebrow">Informacije o proizvodu</p>
          <h2 id="product-overview-heading">Sve važno na jednom mestu.</h2>
        </div>
        <dl>
          <div><dt>Kolekcija</dt><dd>{collection.label}</dd></div>
          <div><dt>Pakovanje</dt><dd>{packageContent}</dd></div>
          <div><dt>Vrsta proizvoda</dt><dd>{productType}</dd></div>
        </dl>
      </section>
      <aside className="product-disclaimer">Dodaci ishrani nisu zamena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Informacije ne predstavljaju medicinski savet.</aside>
      {relatedProducts.length ? <section className="product-related-section"><p className="eyebrow">Istražite dalje</p><h2>Srodni proizvodi</h2><div className="product-grid">{relatedProducts.map((item) => <ProductCard key={item.slug} product={item} detailBasePath={detailBasePath} />)}</div></section> : null}
      {relatedPackages.length ? <section className="mt-12 rounded-3xl bg-[#17301f] p-7 text-[#f7f3ea]"><p className="text-xs font-bold uppercase tracking-wider text-[#dbc487]">BIOTACT paketi</p><h2 className="mt-3 text-2xl font-bold">Povezani paketi</h2><ul className="mt-4 flex flex-wrap gap-3">{relatedPackages.map((item) => <li key={item.slug}><Link className="inline-flex rounded-full border border-[#f7f3ea]/35 px-4 py-2 font-semibold" href={`/paketi/${item.slug}`}>{item.name}</Link></li>)}</ul></section> : null}
      <details className="product-technical-details"><summary>Tehnički podaci</summary><div><p>Interna šifra artikla: {product.article_number}</p><p>Tip ponude: {presentation.type === "multipack" ? "multipack" : presentation.type === "set" ? "set" : "pojedinačni proizvod"}</p></div></details>
    </main>
  );
}
