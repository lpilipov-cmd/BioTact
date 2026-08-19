import Image from "next/image";

import type { PackageProductPresentation } from "@/lib/packages/presentation";

export function PackageComposition({ products, name, priority = false }: Readonly<{ products: readonly PackageProductPresentation[]; name: string; priority?: boolean }>) {
  return (
    <div className="package-composition" data-count={products.length} aria-label={`${name}: ${products.length} proizvoda`}>
      <div className="package-composition-glow" aria-hidden="true" />
      <div className="package-composition-images">
        {products.map((product, index) => (
          <div className="package-composition-product" key={product.articleNumber} data-position={index + 1}>
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 24vw, 18rem"
              quality={90}
              preload={priority && index === 0}
            />
          </div>
        ))}
      </div>
      <span className="package-composition-mark" aria-hidden="true">BIOTACT</span>
    </div>
  );
}
