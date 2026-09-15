import Link from "next/link";

import { formatPackagePrice, packageCategoryLabels } from "@/lib/packages/constants";
import type { ApprovedPackagePresentation } from "@/lib/packages/presentation";

import { PackageComposition } from "./package-composition";

type PackageCardProps = Readonly<{
  packageData: Pick<ApprovedPackagePresentation, "slug" | "name" | "category" | "focus" | "products"> & { priceRsd: number | null };
  detailBasePath?: string;
  priority?: boolean;
  testId?: string;
}>;

export function PackageCard({ packageData, detailBasePath = "/paketi", priority = false, testId = "public-package-card" }: PackageCardProps) {
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
        <div className="package-card-footer">
          <strong>{formatPackagePrice(packageData.priceRsd)}</strong>
          <Link href={`${detailBasePath}/${packageData.slug}`}>Detalji paketa <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
