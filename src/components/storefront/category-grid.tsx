import Image from "next/image";
import Link from "next/link";

import { getProductCollection, productCollections } from "@/lib/products/collections";

import type { StorefrontProduct } from "./storefront-types";

export function CategoryGrid({ products, cataloguePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string }>) {
  return (
    <div className="storefront-category-grid">
      {productCollections.map((collection, index) => {
        const image = products.find(
          (product) => getProductCollection(product.article_number).id === collection.id && product.image_path,
        );
        return (
          <Link
            href={`${cataloguePath}?subcategory=${encodeURIComponent(collection.id)}`}
            className="storefront-category-card"
            data-collection={collection.id}
            key={collection.id}
          >
            <span className="storefront-category-index">0{index + 1}</span>
            {image?.image_path ? <Image src={image.image_path} alt="" fill className="storefront-category-image" sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 20vw" /> : null}
            <span className="storefront-category-shade" aria-hidden="true" />
            <span className="storefront-category-content"><strong>{collection.label}</strong><span>Istraži →</span></span>
          </Link>
        );
      })}
    </div>
  );
}
