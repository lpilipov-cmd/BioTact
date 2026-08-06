import { describe, expect, it } from "vitest";
import { productFormSchema, productMatchesSearch } from "./validation";

const valid = { name: "Test", slug: "test", articleNumber: "80700", catalogueSourceCode: "", category: "zdravlje", subcategory: "", shortDescription: "Neutralna podrška svakodnevnoj rutini.", packageContent: "1000 ml", cataloguePriceEur: "57.88", partnerPriceEur: "41.34", points: "38", priceValidFrom: "2026-04-19", imagePath: "", imageSourceUrl: "", productSourceUrl: "", active: false, sortOrder: "0" };

describe("product validation", () => {
  it("preserves decimal source strings without calculation", () => expect(productFormSchema.parse(valid).cataloguePriceEur).toBe("57.88"));
  it("rejects medical claims", () => expect(productFormSchema.safeParse({ ...valid, shortDescription: "Garantovano leči." }).success).toBe(false));
  it("searches names and article numbers", () => {
    expect(productMatchesSearch("Aloe Vera", "80700", "aloe")).toBe(true);
    expect(productMatchesSearch("Aloe Vera", "80700", "807")).toBe(true);
    expect(productMatchesSearch("Aloe Vera", "80700", "cistus")).toBe(false);
  });
});
