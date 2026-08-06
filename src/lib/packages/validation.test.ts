import { describe, expect, it } from "vitest";

import {
  findMedicalClaims,
  normalizePackageSlug,
  packageFormSchema,
  parseProductCodes,
} from "./validation";

const validPackage = {
  name: "Test paket",
  slug: "Test paket za pokret",
  category: "pokret",
  description: "Pažljivo odabrani proizvodi podržavaju svakodnevnu rutinu.",
  productCodes: "TEMP-001, TEMP-002\nTEMP-001",
  priceRsd: "",
  active: true,
  sortOrder: "10",
};

describe("medicinske tvrdnje", () => {
  it.each([
    "Ovaj proizvod leči tegobe.",
    "Preparat izlečuje problem.",
    "Sprečava bolesti i garantovano deluje.",
    "Nije zamena za lek, dijagnozu ili terapiju.",
  ])("označava rizičan opis: %s", (description) => {
    expect(findMedicalClaims(description).length).toBeGreaterThan(0);
    expect(packageFormSchema.safeParse({ ...validPackage, description }).success).toBe(false);
  });

  it("dozvoljava neutralno wellness formulisanje", () => {
    expect(findMedicalClaims(validPackage.description)).toEqual([]);
    expect(packageFormSchema.safeParse(validPackage).success).toBe(true);
  });

  it("ne označava nepovezane reči sa sličnim početkom", () => {
    expect(findMedicalClaims("Razgovarajte sa lekarom ili stručnim licem.")).toEqual([]);
  });
});

describe("normalizacija paketa", () => {
  it("normalizuje srpski naziv u slug", () => {
    expect(normalizePackageSlug("  Podrška za Pokret  ")).toBe("podrska-za-pokret");
  });

  it("pretvara šifre u jedinstven niz", () => {
    expect(parseProductCodes("TEMP-001, TEMP-002\nTEMP-001")).toEqual([
      "TEMP-001",
      "TEMP-002",
    ]);
  });
});
