import type { CatalogueProduct } from "@/components/public/product-catalogue";

export type StorefrontProduct = CatalogueProduct;

export type StorefrontPackage = Readonly<{
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price_rsd: number | null;
  products: readonly Pick<StorefrontProduct, "article_number" | "slug" | "name" | "package_content" | "catalogue_price_eur" | "image_path">[];
}>;
