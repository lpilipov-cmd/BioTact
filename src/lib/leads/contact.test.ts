import { describe, expect, it } from "vitest";

import { createContactAction, normalizePhoneNumber } from "./contact";

describe("normalizePhoneNumber", () => {
  it.each([
    ["060 111 22 33", "381601112233"],
    ["+381 (60) 111-22-33", "381601112233"],
    ["00381 60 111 22 33", "381601112233"],
    ["+49 151 00000000", "4915100000000"],
  ])("normalizuje %s", (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });

  it.each(["nije kontakt", "123", "+0123456789", "060/111-2233"])(
    "odbija neispravan kontakt %s",
    (input) => expect(normalizePhoneNumber(input)).toBeNull(),
  );
});

describe("createContactAction", () => {
  it("pravi kodiran WhatsApp URL i poruku", () => {
    const action = createContactAction({
      contact: "060 111 22 33",
      name: "Test Osoba",
      packageName: "Privremeni paket",
    });

    expect(action?.kind).toBe("whatsapp");
    expect(action?.href).toContain("https://wa.me/381601112233?text=");
    expect(decodeURIComponent(action?.href ?? "")).toContain(
      "Zdravo Test Osoba, javljamo Vam se povodom Vašeg BIOTACT upita za Privremeni paket.",
    );
  });

  it("pravi mailto umesto WhatsApp akcije za email", () => {
    expect(
      createContactAction({
        contact: "test.osoba@example.invalid",
        name: "Test Osoba",
        packageName: "odabrani paket",
      }),
    ).toEqual({
      kind: "email",
      href: "mailto:test.osoba%40example.invalid",
      label: "Pošalji email",
    });
  });

  it("ne pravi akciju za neispravan kontakt", () => {
    expect(
      createContactAction({
        contact: "kontakt nije dostupan",
        name: "Test Osoba",
        packageName: "odabrani paket",
      }),
    ).toBeNull();
  });
});
