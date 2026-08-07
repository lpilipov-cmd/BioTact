import { describe, expect, it } from "vitest";

import { getProductPresentation } from "./presentation";

describe("product presentation", () => {
  it.each([
    ["80743", "/products/80700/product.webp", "3 × 1.000 ml"],
    ["81003", "/products/81000/product.webp", "3 × 1.000 ml"],
    ["80783", "/products/80750/product.webp", "3 × 1.000 ml"],
    ["80883", "/products/80850/product.webp", "3 × 1.000 ml"],
    ["80823", "/products/80800/product.webp", "3 × 1.000 ml"],
    ["81103", "/products/81100/product.webp", "3 × 1.000 ml"],
    ["80945", "/products/80940/product.webp", "5 × 500 ml"],
  ])("maps SKU %s only to its exact constituent image", (articleNumber, imagePath, quantity) => {
    const presentation = getProductPresentation(articleNumber);
    expect(presentation.type).toBe("multipack");
    expect(presentation.constituentImagePaths).toEqual([imagePath]);
    expect(presentation.quantity).toBe(quantity);
  });

  it("represents 80935 as a free choice between exact Green and Red variants", () => {
    const presentation = getProductPresentation("80935");
    expect(presentation.constituentImagePaths).toEqual([
      "/products/80900/product.webp",
      "/products/80950/product.webp",
    ]);
    expect(presentation.quantity).toBe("5 × 500 ml — izbor Formula Green / Formula Red");
    expect(presentation.constituentNotice).toContain("ne fiksnu kombinaciju");
  });

  it("keeps TurboKid products as unresolved sets", () => {
    for (const articleNumber of ["95213", "96034"]) {
      expect(getProductPresentation(articleNumber)).toMatchObject({
        type: "set",
        constituentImagePaths: [],
      });
    }
  });
});
