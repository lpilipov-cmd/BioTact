import { describe, expect, it } from "vitest";

import { validateEnvironment } from "./env";

describe("validateEnvironment", () => {
  it("allows Supabase configuration to be omitted during initialization", () => {
    expect(validateEnvironment({})).toEqual({});
  });

  it("accepts a complete Supabase configuration", () => {
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
    ).toThrow("Supabase URL i anonimni ključ moraju biti podešeni zajedno.");
  });
});
