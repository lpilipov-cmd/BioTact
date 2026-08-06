import { describe, expect, it } from "vitest";

import { publicLeadSchema } from "./public-validation";

const validLead = {
  name: "Test Osoba",
  contact: "+381 60 123 4567",
  packageInterestId: "10000000-0000-4000-8000-000000000001",
  message: "Želim više informacija.",
  consent: true,
  website: "",
  formStartedAt: 1_750_000_000_000,
  formToken: "a".repeat(64),
  idempotencyKey: "70000000-0000-4000-8000-000000000001",
};

describe("publicLeadSchema", () => {
  it("prihvata validan upit i normalizuje prazna opciona polja", () => {
    const parsed = publicLeadSchema.parse({
      ...validLead,
      packageInterestId: "",
      productInterestId: "",
      message: "   ",
    });
    expect(parsed.packageInterestId).toBeUndefined();
    expect(parsed.message).toBeUndefined();
  });

  it("prihvata proizvod, ali ne paket i proizvod istovremeno", () => {
    const productInterestId = "20000000-0000-4000-8000-000000000001";
    expect(publicLeadSchema.safeParse({ ...validLead, packageInterestId: "", productInterestId }).success).toBe(true);
    expect(publicLeadSchema.safeParse({ ...validLead, productInterestId }).success).toBe(false);
  });

  it.each([
    ["neispravan kontakt", { contact: "nije kontakt" }],
    ["izostanak saglasnosti", { consent: false }],
    ["preduga poruka", { message: "a".repeat(2001) }],
    ["honeypot", { website: "bot.example" }],
    ["neispravan paket", { packageInterestId: "nije-uuid" }],
  ])("odbija %s", (_label, change) => {
    expect(publicLeadSchema.safeParse({ ...validLead, ...change }).success).toBe(false);
  });

  it("prihvata email adresu kao kontakt", () => {
    expect(publicLeadSchema.safeParse({ ...validLead, contact: "test@example.invalid" }).success).toBe(true);
  });
});
