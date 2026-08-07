import type { CatalogueProduct } from "@/components/public/product-catalogue";

export type StorefrontProduct = CatalogueProduct;

export type StorefrontPackage = Readonly<{
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price_rsd: number | null;
  products: readonly Pick<StorefrontProduct, "article_number" | "name" | "image_path">[];
}>;
