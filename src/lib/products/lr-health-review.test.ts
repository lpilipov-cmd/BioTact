import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { findMedicalClaims } from "@/lib/packages/validation";

type ReviewProduct = Readonly<{
  active: boolean;
  article_number: string;
  catalogue_price_eur: string;
  partner_price_eur: string;
  points: string;
  short_description: string | null;
}>;

const review = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/lr-health-products-review.json"), "utf8"),
) as { products: ReviewProduct[] };
const importSql = readFileSync(
  resolve(process.cwd(), "scripts/import-local-health-products.sql"),
  "utf8",
);

describe("reviewed LR health product dataset", () => {
  it("contains unique inactive article numbers and exact decimal strings", () => {
    expect(review.products).toHaveLength(50);
    expect(new Set(review.products.map((product) => product.article_number)).size).toBe(50);
    expect(review.products.every((product) => product.active === false)).toBe(true);
    for (const product of review.products) {
      expect(product.catalogue_price_eur).toMatch(/^\d+\.\d{2}$/);
      expect(product.partner_price_eur).toMatch(/^\d+\.\d{2}$/);
      expect(product.points).toMatch(/^\d+(?:\.\d{1,2})?$/);
    }
  });

  it("keeps every proposed public description free from blocked medical claims", () => {
    for (const product of review.products) {
      expect(findMedicalClaims(product.short_description ?? ""), product.article_number).toEqual([]);
    }
  });

  it("keeps commercial values private and makes the local import guarded and idempotent", () => {
    expect(importSql).toContain("private.product_commercial_data");
    expect(importSql).toContain("current_setting('biotact.local_import', true)");
    expect(importSql).toContain("on conflict (article_number) do update");
    expect(importSql).toContain("on conflict (product_id) do update");
    expect(importSql).toContain("active = false");
    expect(importSql).not.toMatch(/insert into public\.(packages|leads|admin_profiles)/i);
    expect(importSql).not.toMatch(/delete\s+from/i);
  });
});
