import Link from "next/link";

import { formatEurPrice } from "@/lib/products/format";
import { getProductPresentation } from "@/lib/products/presentation";

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
  const presentation = getProductPresentation(product.article_number);
  const hasVerifiedVisual = Boolean(product.image_path || presentation.constituentImagePaths.length);

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
          <p className="eyebrow">{product.subcategory ?? product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatEurPrice(product.catalogue_price_eur)}</p>
          <div className="product-detail-package">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a6b45]">Sadržaj pakovanja</p>
            <p className="mt-2 font-semibold">{product.package_content ?? "Na upit"}</p>
            {presentation.quantity ? <p className="mt-2 text-lg font-bold text-[#17301f]">{presentation.quantity}</p> : null}
          </div>
          {presentation.constituentNotice ? <p className="mt-5 rounded-2xl bg-[#eee5d2] p-4 text-sm leading-6 text-[#405548]">{presentation.constituentNotice}</p> : null}
          {product.short_description ? <p className="mt-6 text-lg leading-8 text-[#405548]">{product.short_description}</p> : null}
          <ul className="product-detail-highlights" aria-label="Proverene informacije o proizvodu">
            <li><span>01</span><strong>{hasVerifiedVisual ? "Proverena varijanta" : "Slika u pripremi"}</strong><small>{hasVerifiedVisual ? "Fotografija i naziv usklađeni su sa pregledanim izvorima." : "Ne koristimo zamensku fotografiju dok tačan prikaz ne bude potvrđen."}</small></li>
            <li><span>02</span><strong>Jasno pakovanje</strong><small>Sadržaj i kataloška cena prikazani su odvojeno i pregledno.</small></li>
            <li><span>03</span><strong>Lična podrška</strong><small>Za dostupnost i poručivanje pošaljite upit BIOTACT podršci.</small></li>
          </ul>
          <div className="product-detail-next-step">
            <Link href={`/kontakt?product=${encodeURIComponent(product.slug)}`} className="button-primary product-detail-action">Pošalji upit za ovaj proizvod</Link>
            <p>Pošalji upit, a mi ćemo ti potvrditi dostupnost i sledeće korake.</p>
          </div>
        </div>
      </article>
      <aside className="product-disclaimer">Dodaci ishrani nisu zamena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Informacije ne predstavljaju medicinski savet.</aside>
      {relatedProducts.length ? <section className="mt-16"><p className="eyebrow">Istražite dalje</p><h2 className="mt-3 text-3xl font-bold">Srodni proizvodi</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((item) => <article key={item.slug} className="product-card"><Link href={`${detailBasePath}/${item.slug}`} className="product-card-image-link"><ProductImage imagePath={item.image_path} articleNumber={item.article_number} name={item.name} sizes="(max-width: 640px) 100vw, 33vw" /></Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#7a6b45]">{item.subcategory}</p><h3 className="mt-2 text-lg font-bold"><Link href={`${detailBasePath}/${item.slug}`}>{item.name}</Link></h3><p className="mt-3 font-bold">{formatEurPrice(item.catalogue_price_eur)}</p></div></article>)}</div></section> : null}
      {relatedPackages.length ? <section className="mt-12 rounded-3xl bg-[#17301f] p-7 text-[#f7f3ea]"><p className="text-xs font-bold uppercase tracking-wider text-[#dbc487]">BIOTACT paketi</p><h2 className="mt-3 text-2xl font-bold">Povezani paketi</h2><ul className="mt-4 flex flex-wrap gap-3">{relatedPackages.map((item) => <li key={item.slug}><Link className="inline-flex rounded-full border border-[#f7f3ea]/35 px-4 py-2 font-semibold" href={`/paketi/${item.slug}`}>{item.name}</Link></li>)}</ul></section> : null}
      <details className="product-technical-details"><summary>Tehnički podaci</summary><div><p>Interna šifra artikla: {product.article_number}</p><p>Tip ponude: {presentation.type === "multipack" ? "multipack" : presentation.type === "set" ? "set" : "pojedinačni proizvod"}</p></div></details>
    </main>
  );
}
