import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { approvedPackagePresentations, hasCanonicalProductMapping, type PackageProductPresentation } from "./presentation";

describe("odobrene prezentacije paketa", () => {
  it("čuvaju četiri identiteta i kanonske sastave bez cena", () => {
    expect(approvedPackagePresentations.map((item) => item.name)).toEqual([
      "Imunitet Start",
      "Creva & Energija",
      "Pokret & Snaga",
      "Srce & Cirkulacija",
    ]);
    expect(approvedPackagePresentations.map((item) => item.products.map((product) => product.articleNumber))).toEqual([
      ["80361", "80325"],
      ["81180", "80205"],
      ["80850", "80190"],
      ["80800", "80338", "80331"],
    ]);
    expect(approvedPackagePresentations.every((item) => item.priceRsd === null)).toBe(true);
  });

  it("odbija izmenjen redosled ili sastav proizvoda", () => {
    expect(hasCanonicalProductMapping("imunitet-start", ["80361-50", "80325-50"])).toBe(true);
    expect(hasCanonicalProductMapping("imunitet-start", ["80325-50", "80361-50"])).toBe(false);
    expect(hasCanonicalProductMapping("imunitet-start", ["80361-50"])).toBe(false);
  });

  it("koristi postojeće proverene slike za svih devet stavki", () => {
    const products: PackageProductPresentation[] = approvedPackagePresentations.flatMap((item) => [...item.products]);
    expect(products).toHaveLength(9);
    for (const product of products) {
      expect(product.imagePath).toBe(`/products/${product.articleNumber}/product.webp`);
      expect(existsSync(resolve("public", product.imagePath.slice(1)))).toBe(true);
    }
  });
});
