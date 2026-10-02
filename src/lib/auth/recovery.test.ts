import { describe, expect, it } from "vitest";

import {
  getRecoveryCallbackUrl,
  validateNewPassword,
  validateRecoveryEmail,
} from "./recovery";

describe("oporavak administratorskog naloga", () => {
  it("normalizuje ispravan email", () => {
    expect(validateRecoveryEmail({ email: " admin@biotact.local " })).toEqual({
      success: true,
      data: { email: "admin@biotact.local" },
    });
  });

  it("odbija neispravan email bez podataka o nalogu", () => {
    expect(validateRecoveryEmail({ email: "nije-email" })).toEqual({
      success: false,
      message: "Unesite ispravnu email adresu.",
    });
  });

  it("zahteva snažnu novu lozinku i potvrdu", () => {
    expect(
      validateNewPassword({
        password: "NovaBezbedna123",
        confirmPassword: "NovaBezbedna123",
      }),
    ).toEqual({
      success: true,
      data: {
        password: "NovaBezbedna123",
        confirmPassword: "NovaBezbedna123",
      },
    });
  });

  it("odbija lozinke koje se ne podudaraju", () => {
    expect(
      validateNewPassword({
        password: "NovaBezbedna123",
        confirmPassword: "DrugaBezbedna123",
      }),
    ).toEqual({ success: false, message: "Lozinke se ne podudaraju." });
  });

  it("uvek koristi fiksnu administratorsku callback putanju", () => {
    expect(getRecoveryCallbackUrl("https://bio-tact.vercel.app/")).toBe(
      "https://bio-tact.vercel.app/admin/auth/callback",
    );
  });
});
