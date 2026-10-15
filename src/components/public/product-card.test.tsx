import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductCard } from "./product-card";

const product = {
  article_number: "80850",
  slug: "aloe-vera-freedom-napitak-80850",
  name: "Aloe vera Freedom napitak",
  category: "zdravlje",
  subcategory: "Aloe Vera",
  short_description: "Tečni dodatak ishrani za svakodnevnu wellness rutinu.",
  package_content: "1.000 ml",
  catalogue_price_eur: 63.55,
  image_path: "/products/80850/product.webp",
} as const;

describe("public product card", () => {
  it("prioritizes supported public product information and the detail action", () => {
    const html = renderToStaticMarkup(<ProductCard product={product} />);

    expect(html).toContain("Aloe vera Freedom napitak");
    expect(html).toContain("Tečni dodatak ishrani za svakodnevnu wellness rutinu.");
    expect(html).toContain("Pakovanje");
    expect(html).toContain("1.000 ml");
    expect(html).toContain("Kataloška cena");
    expect(html).toContain("63,55");
    expect(html).toContain("Pogledaj proizvod");
    expect(html).toContain('href="/proizvodi/aloe-vera-freedom-napitak-80850"');
    expect(html).not.toMatch(/šifra artikla|partnerska cena|poeni/i);
  });
});
