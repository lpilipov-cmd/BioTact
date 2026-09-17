import Image from "next/image";
import Link from "next/link";

import { formatPackagePrice, packageCategoryLabels } from "@/lib/packages/constants";
import type { ApprovedPackagePresentation } from "@/lib/packages/presentation";

import { PackageComposition } from "./package-composition";

type PackageCardProps = Readonly<{
  packageData: Pick<ApprovedPackagePresentation, "slug" | "name" | "category" | "focus" | "products"> & { priceRsd: number | null };
  detailBasePath?: string;
  productDetailBasePath?: string;
  linkedProductSlugs?: ReadonlySet<string>;
  priority?: boolean;
  testId?: string;
}>;

export function PackageCard({
  packageData,
  detailBasePath = "/paketi",
  productDetailBasePath = "/proizvodi",
  linkedProductSlugs = new Set(),
  priority = false,
  testId = "public-package-card",
}: PackageCardProps) {
  return (
    <article className="package-card" data-testid={testId}>
      <Link href={`${detailBasePath}/${packageData.slug}`} className="package-card-visual-link" aria-label={`Pogledaj paket ${packageData.name}`}>
        <PackageComposition products={packageData.products} name={packageData.name} priority={priority} />
      </Link>
      <div className="package-card-body">
        <div className="package-card-heading">
          <p>{packageCategoryLabels[packageData.category]}</p>
          <span>{packageData.products.length} {packageData.products.length === 2 ? "proizvoda" : "proizvoda"}</span>
        </div>
        <h2><Link href={`${detailBasePath}/${packageData.slug}`}>{packageData.name}</Link></h2>
        <p className="package-card-focus">{packageData.focus}</p>
        <div className="package-card-products" aria-label={`Proizvodi u paketu ${packageData.name}`}>
          <p>Proizvodi u paketu</p>
          <div className="package-card-product-list">
            {packageData.products.map((product) => {
              const hasLink = linkedProductSlugs.has(product.slug);
              const content = (
                <>
                  <span className="package-card-product-image">
                    <Image src={product.imagePath} alt="" fill sizes="4rem" className="object-contain" quality={90} />
                  </span>
                  <span className="package-card-product-copy">
                    <strong>{product.name}</strong>
                    <small>{product.packageContent}</small>
                  </span>
                </>
              );

              return hasLink ? (
                <Link href={`${productDetailBasePath}/${product.slug}`} key={product.articleNumber} aria-label={`Pogledaj proizvod ${product.name}`}>
                  {content}
                </Link>
              ) : (
                <span className="package-card-product-item" key={product.articleNumber}>{content}</span>
              );
            })}
          </div>
        </div>
        <div className="package-card-footer">
          <strong>{formatPackagePrice(packageData.priceRsd)}</strong>
          <Link href={`${detailBasePath}/${packageData.slug}`}>Detalji paketa <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
