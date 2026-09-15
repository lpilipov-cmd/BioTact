import Link from "next/link";

import { ProductCard } from "@/components/public/product-card";
import { getProductCollection } from "@/lib/products/collections";

import type { StorefrontProduct } from "./storefront-types";

const previewFeatureOrder = ["80850", "81180", "80900", "81245"] as const;

export function selectFeaturedProducts(products: readonly StorefrontProduct[]) {
  const ordered = previewFeatureOrder.flatMap((articleNumber) => {
    const product = products.find((item) => item.article_number === articleNumber && item.image_path);
    return product ? [product] : [];
  });
  const selectedArticles = new Set(ordered.map((product) => product.article_number));
  const selectedCollections = new Set(ordered.map((product) => getProductCollection(product.article_number).id));

  for (const product of products) {
    const collection = getProductCollection(product.article_number).id;
    if (!product.image_path || selectedArticles.has(product.article_number) || selectedCollections.has(collection)) continue;
    ordered.push(product);
    selectedArticles.add(product.article_number);
    selectedCollections.add(collection);
    if (ordered.length === 4) return ordered;
  }

  for (const product of products) {
    if (!product.image_path || selectedArticles.has(product.article_number)) continue;
    ordered.push(product);
    selectedArticles.add(product.article_number);
    if (ordered.length === 4) break;
  }

  return ordered.slice(0, 4);
}

export function FeaturedProducts({ products, cataloguePath, detailBasePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string; detailBasePath: string }>) {
  const featured = selectFeaturedProducts(products);
  if (!featured.length) return null;

  return (
    <section className="storefront-section storefront-featured-section" aria-labelledby="featured-products-heading">
      <div className="storefront-section-heading">
        <div><p className="storefront-kicker">Pažljivo odabrano</p><h2 id="featured-products-heading">Izdvojeni proizvodi</h2></div>
        <Link href={cataloguePath} className="storefront-text-link">Pogledaj sve proizvode →</Link>
      </div>
      <div className="storefront-featured-grid">{featured.map((product, index) => <ProductCard product={product} detailBasePath={detailBasePath} priority={index < 2} key={product.article_number} />)}</div>
    </section>
  );
}
