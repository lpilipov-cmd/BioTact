import { describe, expect, it } from "vitest";

import { createPackageWhatsAppLink } from "./whatsapp";

describe("createPackageWhatsAppLink", () => {
  it("pravi kodiran link samo kada je broj konfigurisan", () => {
    const link = createPackageWhatsAppLink("381601112233", "Test paket");
    expect(link).toContain("https://wa.me/381601112233?text=");
    expect(decodeURIComponent(link ?? "")).toContain("BIOTACT paketu „Test paket”");
  });

  it("ne izmišlja kontakt kada konfiguracija nedostaje", () => {
    expect(createPackageWhatsAppLink(undefined, "Test paket")).toBeNull();
  });
});
