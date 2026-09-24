import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CartProvider } from "@/components/cart/cart-provider";

import { ProductDetail } from "./product-detail";

const product = {
  id: "product-1",
  article_number: "80361",
  slug: "colostrum-liquid-80361",
  name: "Colostrum Liquid",
  category: "zdravlje",
  subcategory: "Imunitet i kolostrum",
  short_description: "Proizvod za jednostavnu svakodnevnu wellness rutinu.",
  package_content: "125 ml",
  catalogue_price_eur: 62.06,
  image_path: "/products/80361/product.webp",
} as const;

describe("public product detail conversion", () => {
  it("keeps product information visible and makes cart the primary action", () => {
    const html = renderToStaticMarkup(<CartProvider><ProductDetail product={product} relatedProducts={[]} relatedPackages={[]} /></CartProvider>);

    expect(html).toContain("Colostrum Liquid");
    expect(html).toContain("62,06");
    expect(html).toContain("125 ml");
    expect(html).toContain("Imunitet i kolostrum");
    expect(html).toContain("Dodaj u korpu");
    expect(html).toContain("Imam pitanje o proizvodu");
    expect(html).toContain('href="/kontakt?product=colostrum-liquid-80361"');
    expect(html).not.toMatch(/checkout|plati/i);
  });
});
