import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProductImage } from "./product-image";

describe("ProductImage", () => {
  it("prikazuje bezbedan neutralni fallback kada slika nedostaje", () => {
    const markup = renderToStaticMarkup(
      <ProductImage imagePath={null} articleNumber="95213" name="Test proizvod" sizes="100vw" />,
    );

    expect(markup).toContain("Slika proizvoda još nije dostupna");
    expect(markup).toContain('data-testid="missing-product-image"');
    expect(markup).not.toContain("<img");
  });

  it("prikazuje tačnu količinu i konstitutivnu sliku bez izmišljene ambalaže", () => {
    const markup = renderToStaticMarkup(
      <ProductImage imagePath={null} articleNumber="80743" name="Aloe vera napitak sa medom pakovanje od 3" sizes="100vw" />,
    );

    expect(markup).toContain("%2Fproducts%2F80700%2Fproduct.webp");
    expect(markup).toContain("3 × 1.000 ml");
    expect(markup).toContain("MULTIPACK");
    expect(markup).not.toMatch(/kutija|box/i);
  });
});
