import { describe, expect, it } from "vitest";

import { parseLeadFilters } from "./constants";

describe("parseLeadFilters", () => {
  it("prihvata samo dozvoljene filtere", () => {
    expect(parseLeadFilters({ status: "novo", channel: "website" })).toEqual({
      status: "novo",
      channel: "website",
    });
  });

  it("bezbedno ignoriše nepoznate i ponovljene vrednosti", () => {
    expect(
      parseLeadFilters({ status: "obrisan", channel: ["instagram", "website"] }),
    ).toEqual({ status: undefined, channel: "instagram" });
  });
});
