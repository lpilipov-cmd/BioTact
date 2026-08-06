import { describe, expect, it } from "vitest";

import { createLeadSuccessWhatsAppLink } from "./whatsapp";

describe("createLeadSuccessWhatsAppLink", () => {
  it("kodira bezbednu poruku za potvrđeni broj", () => {
    const link = createLeadSuccessWhatsAppLink("+381 60 111 22 33");
    expect(link).toContain("https://wa.me/381601112233?text=");
    expect(link).toContain("BIOTACT%20sajta");
  });

  it("ne prikazuje link bez validnog broja", () => {
    expect(createLeadSuccessWhatsAppLink(undefined)).toBeNull();
    expect(createLeadSuccessWhatsAppLink("nije-broj")).toBeNull();
  });
});
