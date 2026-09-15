import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CategoryGrid } from "./category-grid";
import { FeaturedProducts, selectFeaturedProducts } from "./featured-products";
import type { StorefrontProduct } from "./storefront-types";

function product(articleNumber: string, imagePath = `/products/${articleNumber}/product.webp`): StorefrontProduct {
  return {
    article_number: articleNumber,
    slug: `proizvod-${articleNumber}`,
    name: `Proizvod ${articleNumber}`,
    category: "zdravlje",
    subcategory: null,
    short_description: null,
    package_content: "100 ml",
    catalogue_price_eur: 25,
    image_path: imagePath,
  };
}

describe("Storefront product discovery", () => {
  it("links all canonical collections through the existing catalogue query", () => {
    const html = renderToStaticMarkup(<CategoryGrid products={[]} cataloguePath="/proizvodi" />);

    expect(html.match(/class="storefront-category-card"/g)).toHaveLength(8);
    expect(html).toContain("Digestija i ravnoteža");
    expect(html).toContain("Body Mission / FiguActive");
    expect(html).toContain("/proizvodi?subcategory=aloe-vera");
    expect(html).toContain("/proizvodi?subcategory=digestija-i-ravnoteza");
    expect(html).toContain("/proizvodi?subcategory=body-mission");
  });

  it("selects four verified preview products in the approved visual order", () => {
    const products = [product("81245"), product("80900"), product("81180"), product("80850")];

    expect(selectFeaturedProducts(products).map((item) => item.article_number)).toEqual([
      "80850",
      "81180",
      "80900",
      "81245",
    ]);
  });

  it("hides featured products when the public active-product query is empty", () => {
    const html = renderToStaticMarkup(
      <FeaturedProducts products={[]} cataloguePath="/proizvodi" detailBasePath="/proizvodi" />,
    );

    expect(html).toBe("");
  });
});
