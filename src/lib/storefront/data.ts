import type { StorefrontPackage } from "@/components/storefront/storefront-types";

type PackageRow = Omit<StorefrontPackage, "products">;
type ProductRelation = Readonly<{
  package_id: string;
  sort_order: number;
  product: StorefrontPackage["products"][number] | null;
}>;

export function buildStorefrontPackages(packages: readonly PackageRow[], relations: readonly ProductRelation[]): StorefrontPackage[] {
  return packages.map((item) => ({
    ...item,
    products: relations
      .filter((relation) => relation.package_id === item.id && relation.product)
      .sort((left, right) => left.sort_order - right.sort_order)
      .flatMap((relation) => relation.product ? [relation.product] : []),
  }));
}
