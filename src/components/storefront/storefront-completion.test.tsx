import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/public/site-footer";

import { StorefrontCTA } from "./storefront-cta";
import { OrderFlow } from "./order-flow";
import { TrustSection } from "./trust-section";

describe("Storefront completion", () => {
  it("explains the three-step enquiry order flow without implying checkout", () => {
    const html = renderToStaticMarkup(<OrderFlow />);

    for (const step of ["Izaberi proizvod", "Pošalji upit", "Potvrdi porudžbinu"]) {
      expect(html).toContain(step);
    }
    expect(html).toContain("nema samostalni kartični checkout");
    expect(html).not.toMatch(/dodaj u korpu|plati karticom/i);
  });

  it("presents four concise trust points and the LR relationship transparently", () => {
    const html = renderToStaticMarkup(<TrustSection />);

    for (const point of [
      "Jasno organizovan portfolio",
      "Proverene informacije",
      "Transparentan pregled proizvoda",
      "Lična podrška",
    ]) {
      expect(html).toContain(point);
    }
    expect(html).toContain("BIOTACT nije proizvođač prikazanih LR proizvoda.");
    expect(html).not.toMatch(/sertifik|garantovano|leči|sprečava/i);
  });

  it("links the final CTA to the public catalogue and contact page", () => {
    const html = renderToStaticMarkup(<StorefrontCTA />);

    expect(html).toContain("Pronađi rutinu koja ti odgovara.");
    expect(html).toContain('href="/proizvodi"');
    expect(html).toContain('href="/kontakt"');
  });

  it("keeps the public footer concise, transparent and free of admin navigation", () => {
    const html = renderToStaticMarkup(<SiteFooter />);

    for (const href of ["/proizvodi", "/paketi", "/o-nama", "/kontakt"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain("BIOTACT predstavlja proizvode iz LR Health &amp; Beauty portfolija.");
    expect(html).toContain("Dodaci ishrani nisu zamena za raznovrsnu ishranu");
    expect(html).not.toMatch(/href="\/admin/);
  });
});
