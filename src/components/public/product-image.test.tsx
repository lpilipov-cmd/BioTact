import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductImage } from "./product-image";

describe("ProductImage", () => {
  it("prikazuje bezbedan neutralni fallback kada slika nedostaje", () => {
    const markup = renderToStaticMarkup(
      <ProductImage imagePath={null} name="Test proizvod" sizes="100vw" />,
    );

    expect(markup).toContain("Slika proizvoda još nije dostupna");
    expect(markup).toContain('data-testid="missing-product-image"');
    expect(markup).not.toContain("<img");
  });
});
