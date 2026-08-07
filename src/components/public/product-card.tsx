import Link from "next/link";

import { getProductCollection } from "@/lib/products/collections";
import { formatEurPrice } from "@/lib/products/format";
import { getProductPresentation } from "@/lib/products/presentation";

import type { CatalogueProduct } from "./product-catalogue";
import { ProductImage } from "./product-image";

export function ProductCard({ product, detailBasePath = "/proizvodi", priority = false }: Readonly<{ product: CatalogueProduct; detailBasePath?: string; priority?: boolean }>) {
  const presentation = getProductPresentation(product.article_number);
  const collection = getProductCollection(product.article_number);
  return (
    <article className="product-card catalogue-product-card" data-collection={collection.id}>
      <Link href={`${detailBasePath}/${product.slug}`} aria-label={`Pogledaj proizvod ${product.name}`} className="product-card-image-link">
        <ProductImage imagePath={product.image_path} articleNumber={product.article_number} name={product.name} sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw" priority={priority} />
      </Link>
      <div className="product-card-body">
        <p className="product-card-classification">{collection.label}</p>
        <h3><Link href={`${detailBasePath}/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-card-purchase">
          <p className="product-card-content">{presentation.quantity ?? product.package_content ?? "Sadržaj pakovanja na upit"}</p>
          <p className="product-card-price">{formatEurPrice(product.catalogue_price_eur)}</p>
          <Link className="product-card-cta" href={`${detailBasePath}/${product.slug}`}>Pogledaj proizvod <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
