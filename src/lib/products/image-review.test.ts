import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import imageReview from "../../../data/lr-health-product-images-review.json";

describe("LR product image review", () => {
  it("contains one unique, valid decision for every reviewed article", () => {
    expect(imageReview.products).toHaveLength(50);
    expect(new Set(imageReview.products.map((item) => item.article_number)).size).toBe(50);
    expect(imageReview.totals).toEqual({ candidates: 50, verified: 35, unresolved: 15 });
  });

  it("keeps every verified derivative local and resolvable", () => {
    for (const item of imageReview.products) {
      if (item.image_status === "verified") {
        expect(item.local_image_path).toMatch(/^\/products\/\d+\/product\.webp$/);
        expect(existsSync(resolve("public", item.local_image_path!.slice(1)))).toBe(true);
        expect(item.image_dimensions?.width).toBeGreaterThan(0);
        expect(item.image_dimensions?.height).toBeGreaterThan(0);
      } else {
        expect(item.local_image_path).toBeNull();
      }
    }
  });
});
