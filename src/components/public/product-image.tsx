import Image from "next/image";

type ProductImageProps = Readonly<{
  imagePath: string | null;
  name: string;
  sizes: string;
  priority?: boolean;
}>;

export function ProductImage({ imagePath, name, sizes, priority = false }: ProductImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eae1cb]">
      {imagePath ? (
        <Image
          src={imagePath}
          alt={name}
          fill
          className="object-contain p-4"
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <div
          className="flex h-full items-center justify-center p-6 text-center text-sm text-[#5b6960]"
          data-testid="missing-product-image"
        >
          Slika proizvoda još nije dostupna
        </div>
      )}
    </div>
  );
}
