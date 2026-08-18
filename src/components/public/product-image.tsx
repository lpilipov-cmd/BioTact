import Image from "next/image";

import { getProductPresentation } from "@/lib/products/presentation";

type ProductImageProps = Readonly<{
  imagePath: string | null;
  articleNumber: string;
  name: string;
  sizes: string;
  preload?: boolean;
}>;

export function ProductImage({ imagePath, articleNumber, name, sizes, preload = false }: ProductImageProps) {
  const presentation = getProductPresentation(articleNumber);
  const imagePaths = presentation.constituentImagePaths.length
    ? presentation.constituentImagePaths
    : imagePath
      ? [imagePath]
      : [];

  return (
    <div
      className="product-visual relative overflow-hidden rounded-2xl bg-[#eae1cb]"
      data-image-scale={presentation.imageScale ?? "standard"}
      data-product-type={presentation.type}
    >
      {imagePaths.length ? (
        <div className={`product-visual-images ${imagePaths.length > 1 ? "product-visual-images-dual" : "product-visual-images-single"}`}>
          {imagePaths.map((path, index) => (
            <div className="product-visual-image" key={path}>
              <Image
                src={path}
                alt={imagePaths.length > 1 ? `${name} — varijanta ${index + 1}` : name}
                fill
                className="product-visual-media object-contain"
                sizes={sizes}
                preload={preload && index === 0}
                quality={90}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="product-image-fallback"
          data-testid="missing-product-image"
        >
          <span aria-hidden="true">BIOTACT</span>
          <strong>Slika proizvoda još nije dostupna</strong>
          <small>Prikaz će biti dodat tek nakon provere tačnog LR pakovanja.</small>
        </div>
      )}
      {presentation.badge ? <span className="product-type-badge">{presentation.badge}</span> : null}
      {presentation.quantity ? <span className="product-quantity-badge">{presentation.quantity}</span> : null}
    </div>
  );
}
