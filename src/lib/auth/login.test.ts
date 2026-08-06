import { describe, expect, it } from "vitest";

import { validateLoginInput } from "./login";

describe("validacija administratorske prijave", () => {
  it("prihvata ispravne podatke", () => {
    expect(
      validateLoginInput({
        email: "admin@biotact.local",
        password: "bezbedna-lozinka",
      }),
    ).toEqual({
      success: true,
      data: {
        email: "admin@biotact.local",
        password: "bezbedna-lozinka",
      },
    });
  });

  it("vraća bezbednu poruku za neispravan email", () => {
    expect(
      validateLoginInput({ email: "nije-email", password: "lozinka" }),
    ).toEqual({
      success: false,
      message: "Unesite ispravnu email adresu.",
    });
  });

  it("zahteva lozinku", () => {
    expect(
      validateLoginInput({ email: "admin@biotact.local", password: "" }),
    ).toEqual({
      success: false,
      message: "Unesite lozinku.",
    });
  });
});
