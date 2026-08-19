import Image from "next/image";
import Link from "next/link";

import { formatPackagePrice, packageCategoryLabels } from "@/lib/packages/constants";
import type { ApprovedPackagePresentation } from "@/lib/packages/presentation";

import { PackageComposition } from "./package-composition";

type PackageDetailProps = Readonly<{
  packageData: Omit<ApprovedPackagePresentation, "priceRsd"> & { priceRsd: number | null };
  description?: string;
  productDetailBasePath?: string;
  linkedProductSlugs?: ReadonlySet<string>;
  preview?: boolean;
}>;

export function PackageDetail({
  packageData,
  description = packageData.description,
  productDetailBasePath = "/proizvodi",
  linkedProductSlugs = new Set(),
  preview = false,
}: PackageDetailProps) {
  const contactHref = `/kontakt?package=${encodeURIComponent(packageData.slug)}`;

  return (
    <main id="glavni-sadrzaj" className="package-detail-page">
      <div className="package-detail-shell">
        <Link href={preview ? "/admin/packages/preview" : "/paketi"} className="package-back-link">← Nazad na pakete</Link>
        {preview ? <p className="package-preview-badge">Zaštićeni vlasnički pregled</p> : null}

        <article className="package-detail-hero">
          <div className="package-detail-visual">
            <PackageComposition products={packageData.products} name={packageData.name} priority />
          </div>
          <div className="package-detail-information">
            <p className="package-kicker">BIOTACT kolekcija · {packageCategoryLabels[packageData.category]}</p>
            <h1>{packageData.name}</h1>
            <p className="package-detail-description">{description}</p>
            <div className="package-detail-purchase">
              <div><span>Cena paketa</span><strong>{formatPackagePrice(packageData.priceRsd)}</strong></div>
              <Link href={contactHref} className="button-gold">Pošalji upit</Link>
            </div>
            <p className="package-detail-note">Upit ne predstavlja kupovinu. Dostupnost i poručivanje potvrđuju se kroz lični kontakt i odgovarajući LR proces.</p>
          </div>
        </article>

        <section className="package-included" aria-labelledby="package-included-heading">
          <div className="package-section-heading">
            <p className="package-kicker">Sastav kolekcije</p>
            <h2 id="package-included-heading">Šta paket sadrži</h2>
            <p>{packageData.products.length} pažljivo grupisana {packageData.products.length === 2 ? "proizvoda" : "proizvoda"}, prikazana bez dodatne ambalaže ili izmišljenog pakovanja.</p>
          </div>
          <div className="package-product-grid">
            {packageData.products.map((product) => {
              const hasLink = linkedProductSlugs.has(product.slug);
              const content = (
                <>
                  <div className="package-product-image">
                    <Image src={product.imagePath} alt={product.name} fill className="object-contain" sizes="(max-width: 640px) 46vw, 18rem" quality={90} />
                  </div>
                  <div className="package-product-copy">
                    <p>{product.packageContent}</p>
                    <h3>{product.name}</h3>
                    {hasLink ? <span>Pogledaj proizvod →</span> : <span>Detalji proizvoda biće dostupni po objavi</span>}
                  </div>
                </>
              );

              return hasLink ? (
                <Link className="package-product-card" href={`${productDetailBasePath}/${product.slug}`} key={product.articleNumber} aria-label={`Pogledaj proizvod ${product.name}`}>
                  {content}
                </Link>
              ) : (
                <article className="package-product-card" key={product.articleNumber}>{content}</article>
              );
            })}
          </div>
        </section>

        <section className="package-rationale" aria-labelledby="package-rationale-heading">
          <p className="package-kicker">Logika izbora</p>
          <h2 id="package-rationale-heading">Zašto je ovaj paket organizovan ovako</h2>
          <p>{packageData.rationale}</p>
        </section>

        <section className="package-contact-cta" aria-labelledby="package-contact-heading">
          <div>
            <p className="package-kicker package-kicker-light">Lična podrška</p>
            <h2 id="package-contact-heading">Proverite da li ovaj paket odgovara vašoj rutini.</h2>
          </div>
          <Link href={contactHref} className="button-gold">Pošalji upit za paket</Link>
        </section>

        <aside className="package-responsible-note">
          Dodaci ishrani nisu zamena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Informacije na sajtu ne predstavljaju medicinski savet.
        </aside>
      </div>
    </main>
  );
}
