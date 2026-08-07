import Link from "next/link";

import { formatEurPrice } from "@/lib/products/format";

import type { CatalogueProduct } from "./product-catalogue";
import { ProductImage } from "./product-image";

type Product = CatalogueProduct & Readonly<{ article_number: string }>;
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
  return (
    <main id="glavni-sadrzaj" className="product-detail-shell">
      <Link href={cataloguePath} className="product-back-link">← Nazad na proizvode</Link>
      {preview ? <p className="mt-6 inline-flex rounded-full bg-[#17301f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f7f3ea]">Zaštićeni vlasnički pregled</p> : null}
      <article className="product-detail-hero">
        <div className="product-detail-image"><ProductImage imagePath={product.image_path} name={product.name} sizes="(max-width: 768px) 100vw, 50vw" priority /></div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow">{product.subcategory ?? product.category}</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-2xl font-bold">{formatEurPrice(product.catalogue_price_eur)}</p>
          <div className="mt-6 border-y border-[#17301f]/15 py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a6b45]">Sadržaj pakovanja</p>
            <p className="mt-2 font-semibold">{product.package_content ?? "Na upit"}</p>
          </div>
          {product.short_description ? <p className="mt-6 text-lg leading-8 text-[#405548]">{product.short_description}</p> : null}
          <Link href={`/kontakt?product=${encodeURIComponent(product.slug)}`} className="button-primary mt-8 self-start">Pošalji upit</Link>
          <details className="mt-6 text-sm text-[#5b6960]"><summary className="cursor-pointer font-semibold">Tehnički podaci</summary><p className="mt-2">Interna šifra artikla: {product.article_number}</p></details>
        </div>
      </article>
      <aside className="product-disclaimer">Dodaci ishrani nisu zamena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Informacije ne predstavljaju medicinski savet.</aside>
      {relatedProducts.length ? <section className="mt-16"><p className="eyebrow">Istražite dalje</p><h2 className="mt-3 text-3xl font-bold">Srodni proizvodi</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((item) => <article key={item.slug} className="product-card"><Link href={`${detailBasePath}/${item.slug}`} className="product-card-image-link"><ProductImage imagePath={item.image_path} name={item.name} sizes="(max-width: 640px) 100vw, 33vw" /></Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#7a6b45]">{item.subcategory}</p><h3 className="mt-2 text-lg font-bold"><Link href={`${detailBasePath}/${item.slug}`}>{item.name}</Link></h3><p className="mt-3 font-bold">{formatEurPrice(item.catalogue_price_eur)}</p></div></article>)}</div></section> : null}
      {relatedPackages.length ? <section className="mt-12 rounded-3xl bg-[#17301f] p-7 text-[#f7f3ea]"><p className="text-xs font-bold uppercase tracking-wider text-[#dbc487]">BIOTACT paketi</p><h2 className="mt-3 text-2xl font-bold">Povezani paketi</h2><ul className="mt-4 flex flex-wrap gap-3">{relatedPackages.map((item) => <li key={item.slug}><Link className="inline-flex rounded-full border border-[#f7f3ea]/35 px-4 py-2 font-semibold" href={`/paketi/${item.slug}`}>{item.name}</Link></li>)}</ul></section> : null}
    </main>
  );
}
