import Image from "next/image";
import Link from "next/link";

import type { StorefrontProduct } from "./storefront-types";

const categories = [
  { label: "Aloe Vera", subcategory: "Aloe Vera", note: "Gelovi za piće i svakodnevna rutina" },
  { label: "Imunitet", subcategory: "Imunitet i kolostrum", note: "Kolostrum i odabrani mikronutrijenti" },
  { label: "Digestija", subcategory: "Digestivna podrška", note: "Proizvodi za promišljenu rutinu ishrane" },
  { label: "Energija i fokus", subcategory: "Mind Master", note: "Funkcionalni napici za aktivan dan" },
  { label: "Pokret", subcategory: "Pokret i snaga", note: "Podrška aktivnom načinu života" },
  { label: "Srce i cirkulacija", subcategory: "Srce i cirkulacija", note: "Pažljivo odabrani dodaci ishrani" },
  { label: "Lepota iznutra", subcategory: "Wellness podrška", note: "Wellness formule i beauty rutina" },
  { label: "Body Mission", subcategory: "LR FIGUACTIVE i Body Mission", note: "Praktični obroci i pametni pratioci" },
] as const;

export function CategoryGrid({ products, cataloguePath }: Readonly<{ products: readonly StorefrontProduct[]; cataloguePath: string }>) {
  return (
    <div className="storefront-category-grid">
      {categories.map((category, index) => {
        const image = products.find((product) => product.subcategory === category.subcategory && product.image_path);
        return (
          <Link href={`${cataloguePath}?subcategory=${encodeURIComponent(category.subcategory)}`} className="storefront-category-card" key={category.label}>
            <span className="storefront-category-index">0{index + 1}</span>
            {image?.image_path ? <Image src={image.image_path} alt="" fill className="storefront-category-image" sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 20vw" /> : null}
            <span className="storefront-category-shade" aria-hidden="true" />
            <span className="storefront-category-content"><strong>{category.label}</strong><small>{category.note}</small><span>Istraži →</span></span>
          </Link>
        );
      })}
    </div>
  );
}
