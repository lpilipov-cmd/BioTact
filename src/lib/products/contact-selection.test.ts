import { describe, expect, it } from "vitest";

import { resolveContactInterest } from "./contact-selection";

const packages = [{ id: "package-id", slug: "imunitet" }];
const products = [{ id: "product-id", slug: "aloe-vera" }];

describe("resolveContactInterest", () => {
  it("čuva postojeći izbor paketa", () => {
    expect(resolveContactInterest(packages, products, "imunitet", undefined)).toEqual({
      packageInterestId: "package-id",
      productInterestId: undefined,
    });
  });

  it("preselektuje aktivni proizvod kada paket nije izabran", () => {
    expect(resolveContactInterest(packages, products, undefined, "aloe-vera")).toEqual({
      packageInterestId: undefined,
      productInterestId: "product-id",
    });
  });

  it("daje prioritet paketu i nikada ne bira oba interesovanja", () => {
    expect(resolveContactInterest(packages, products, "imunitet", "aloe-vera")).toEqual({
      packageInterestId: "package-id",
      productInterestId: undefined,
    });
  });
});
