import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  fallbackProductCollection,
  getProductCollection,
  parseProductCollectionQuery,
  productCollections,
} from "./collections";
import { findMedicalClaims } from "@/lib/packages/validation";

type ReviewProduct = Readonly<{ article_number: string }>;

const review = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/lr-health-products-review.json"), "utf8"),
) as { products: ReviewProduct[] };

describe("product presentation collections", () => {
  it("maps all 50 reviewed products exactly once to a supported collection", () => {
    const assignments = productCollections.flatMap((collection) => collection.articleNumbers);

    expect(review.products).toHaveLength(50);
    expect(assignments).toHaveLength(50);
    expect(new Set(assignments).size).toBe(50);
    expect(new Set(assignments)).toEqual(new Set(review.products.map((product) => product.article_number)));
    expect(review.products.every((product) => getProductCollection(product.article_number) !== fallbackProductCollection)).toBe(true);
  });

  it("keeps the catalogue grouping deterministic and family-led", () => {
    expect(Object.fromEntries(productCollections.map((collection) => [collection.id, collection.articleNumbers.length]))).toEqual({
      "aloe-vera": 14,
      "digestija-i-ravnoteza": 5,
      imunitet: 3,
      "energija-i-fokus": 7,
      "srce-i-cirkulacija": 2,
      "pokret-i-aktivan-zivot": 2,
      "lepota-i-posebne-rutine": 3,
      "body-mission": 14,
    });
    expect(getProductCollection("80743").id).toBe("aloe-vera");
    expect(getProductCollection("80935").id).toBe("energija-i-fokus");
    expect(getProductCollection("81260").id).toBe("body-mission");
  });

  it("keeps compatible links from the existing storefront category navigation", () => {
    expect(parseProductCollectionQuery("Aloe Vera")).toBe("aloe-vera");
    expect(parseProductCollectionQuery("Mind Master")).toBe("energija-i-fokus");
    expect(parseProductCollectionQuery("LR FIGUACTIVE i Body Mission")).toBe("body-mission");
    expect(parseProductCollectionQuery("nepoznato")).toBe("");
  });

  it("keeps collection descriptions neutral and free from blocked medical claims", () => {
    for (const collection of productCollections) {
      expect(findMedicalClaims(collection.description), collection.id).toEqual([]);
    }
  });
});
