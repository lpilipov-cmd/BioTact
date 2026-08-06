import { describe, expect, it } from "vitest";

import {
  requireSupabaseEnvironment,
  validateEnvironment,
} from "./env";

describe("validateEnvironment", () => {
  it("allows Supabase configuration to be omitted during initialization", () => {
    expect(validateEnvironment({})).toEqual({});
  });

  it("prihvata aktuelni javni Supabase ključ", () => {
    expect(
      validateEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "a".repeat(20),
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "a".repeat(20),
    });
  });

  it("zadržava kompatibilnost sa starim anonimnim ključem", () => {
    expect(
      validateEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "a".repeat(20),
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "a".repeat(20),
    });
  });

  it("rejects an incomplete Supabase configuration", () => {
    expect(() =>
      validateEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
    ).toThrow("Supabase URL i javni ključ moraju biti podešeni zajedno.");
  });

  it("zahteva oba javna Supabase podatka za rad klijenta", () => {
    expect(() =>
      requireSupabaseEnvironment(validateEnvironment({})),
    ).toThrow("Supabase javne promenljive okruženja nisu podešene.");
  });

  it("prihvata opcioni javni WhatsApp broj", () => {
    expect(
      validateEnvironment({ NEXT_PUBLIC_WHATSAPP_NUMBER: "381601112233" }),
    ).toEqual({ NEXT_PUBLIC_WHATSAPP_NUMBER: "381601112233" });
  });
});
