import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { parseSerbianDecimal, parseSerbianHealthRows, reconcileRows } from "../../../scripts/lib/lr-health-price-list";

const fixture = readFileSync(resolve(process.cwd(), "src/lib/products/test-fixtures/lr-price-list.html"), "utf8");

describe("LR Serbian health price-list parser", () => {
  it("accepts only Serbian EUR Aloe Vera and Zdravlje rows before cosmetics", () => {
    const rows = parseSerbianHealthRows(fixture);
    expect(rows.map((row) => row.articleNumber)).toEqual(["80700", "80360", "80360"]);
    expect(rows.every((row) => row.partnerPrice.endsWith(" EUR"))).toBe(true);
    expect(rows.some((row) => row.name.includes("mézes"))).toBe(false);
  });

  it("rejects Ft and preserves Serbian comma decimals exactly", () => {
    expect(() => parseSerbianDecimal("13.850 Ft", " EUR")).toThrow();
    expect(parseSerbianDecimal("57,88 EUR", " EUR")).toBe("57.88");
    expect(parseSerbianDecimal("38p", "p")).toBe("38");
  });

  it("collapses identical duplicates and blocks conflicting duplicates", () => {
    const rows = parseSerbianHealthRows(fixture);
    const safe = reconcileRows(rows);
    expect(safe.collapsed.map((item) => item.articleNumber)).toEqual(["80360"]);
    const conflicting = reconcileRows([...rows, { ...rows[0], cataloguePrice: "58,00 EUR" }]);
    expect(conflicting.conflicts[0]).toMatchObject({ articleNumber: "80700", differingFields: ["cataloguePrice"] });
    expect(conflicting.canonical.some((row) => row.articleNumber === "80700")).toBe(false);
  });
});
