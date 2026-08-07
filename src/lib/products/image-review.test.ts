import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import imageReview from "../../../data/lr-health-product-images-review.json";

describe("LR product image review", () => {
  it("contains one unique, valid decision for every reviewed article", () => {
    expect(imageReview.products).toHaveLength(50);
    expect(new Set(imageReview.products.map((item) => item.article_number)).size).toBe(50);
    expect(imageReview.totals).toEqual({
      candidates: 50,
      verified_unique_image: 40,
      verified_constituent_image: 8,
      unresolved: 2,
      visual_coverage: 48,
    });
  });

  it("keeps every verified derivative local and resolvable", () => {
    for (const item of imageReview.products) {
      if (item.image_status === "verified_unique_image") {
        expect(item.local_image_path).toMatch(/^\/products\/\d+\/product\.webp$/);
        expect(existsSync(resolve("public", item.local_image_path!.slice(1)))).toBe(true);
        expect(item.image_dimensions?.width).toBeGreaterThan(0);
        expect(item.image_dimensions?.height).toBeGreaterThan(0);
      } else if (item.image_status === "verified_constituent_image") {
        expect(item.constituent_image_paths?.length).toBeGreaterThan(0);
        for (const imagePath of item.constituent_image_paths ?? []) {
          expect(existsSync(resolve("public", imagePath.slice(1)))).toBe(true);
        }
      } else {
        expect(item.local_image_path).toBeNull();
      }
    }
  });

  it("does not reuse one derivative for unrelated reviewed SKUs", () => {
    const hashes = imageReview.products
      .filter((item) => item.image_status === "verified_unique_image")
      .map((item) => createHash("sha256").update(readFileSync(resolve("public", item.local_image_path!.slice(1)))).digest("hex"));

    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it("uses shared artwork only for explicitly verified constituent relationships", () => {
    const constituentSkus = imageReview.products
      .filter((item) => item.image_status === "verified_constituent_image")
      .map((item) => item.article_number);
    expect(constituentSkus).toEqual(["80743", "81003", "80783", "80883", "80823", "81103", "80935", "80945"]);
    expect(imageReview.products.filter((item) => item.image_status === "unresolved").map((item) => item.article_number)).toEqual(["95213", "96034"]);
  });
});
