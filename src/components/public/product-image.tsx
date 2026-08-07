import Image from "next/image";

import { getProductPresentation } from "@/lib/products/presentation";

type ProductImageProps = Readonly<{
  imagePath: string | null;
  articleNumber: string;
  name: string;
  sizes: string;
  priority?: boolean;
}>;

export function ProductImage({ imagePath, articleNumber, name, sizes, priority = false }: ProductImageProps) {
  const presentation = getProductPresentation(articleNumber);
  const imagePaths = presentation.constituentImagePaths.length
    ? presentation.constituentImagePaths
    : imagePath
      ? [imagePath]
      : [];

  return (
    <div className="product-visual relative aspect-square overflow-hidden rounded-2xl bg-[#eae1cb]" data-product-type={presentation.type}>
      {imagePaths.length ? (
        <div className={`product-visual-images ${imagePaths.length > 1 ? "product-visual-images-dual" : ""}`}>
          {imagePaths.map((path, index) => (
            <div className="product-visual-image" key={path}>
              <Image
                src={path}
                alt={imagePaths.length > 1 ? `${name} — varijanta ${index + 1}` : name}
                fill
                className="object-contain p-4"
                sizes={sizes}
                priority={priority && index === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex h-full items-center justify-center p-6 text-center text-sm text-[#5b6960]"
          data-testid="missing-product-image"
        >
          Slika proizvoda još nije dostupna
        </div>
      )}
      {presentation.badge ? <span className="product-type-badge">{presentation.badge}</span> : null}
      {presentation.quantity ? <span className="product-quantity-badge">{presentation.quantity}</span> : null}
    </div>
  );
}
