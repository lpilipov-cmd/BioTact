import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { approvedPackagePresentations } from "@/lib/packages/presentation";

import { getGuidedSelectionPaths, GuidedSelection } from "./guided-selection";
import { PackageShowcase } from "./package-showcase";
import type { StorefrontPackage } from "./storefront-types";

const packages: StorefrontPackage[] = approvedPackagePresentations.map((item) => ({
  id: item.slug,
  slug: item.slug,
  name: item.name,
  category: item.category,
  description: item.description,
  price_rsd: null,
  products: [],
}));

describe("Storefront package discovery", () => {
  it("reuses the approved package cards for all four visible packages", () => {
    const html = renderToStaticMarkup(<PackageShowcase packages={packages} />);

    expect(html.match(/data-testid="featured-package-card"/g)).toHaveLength(4);
    expect(html.match(/Cena na upit/g)).toHaveLength(4);
    expect(html).toContain("Imunitet Start");
    expect(html).toContain("Srce &amp; Cirkulacija");
    expect(html).toContain('href="/paketi/pokret-snaga"');
    expect(html).not.toMatch(/partnerska cena|poeni|80361-50|80800-50/i);
  });

  it("does not render approved package data that was not passed by visibility rules", () => {
    const html = renderToStaticMarkup(<PackageShowcase packages={packages.slice(0, 1)} />);

    expect(html).toContain("Imunitet Start");
    expect(html).not.toContain("Creva &amp; Energija");
  });

  it("uses only canonical catalogue destinations for guided navigation", () => {
    expect(getGuidedSelectionPaths("/proizvodi")).toEqual([
      ["Želim više energije", "/proizvodi?subcategory=energija-i-fokus"],
      ["Tražim jednostavnu dnevnu rutinu", "/proizvodi?subcategory=aloe-vera"],
      ["Aktivan sam i treniram", "/proizvodi?subcategory=pokret-i-aktivan-zivot"],
      ["Želim da pregledam sve", "/proizvodi"],
    ]);

    const html = renderToStaticMarkup(<GuidedSelection cataloguePath="/proizvodi" />);
    expect(html).toContain("bez automatizovanih preporuka");
    expect(html).not.toMatch(/simptom|dijagno|zdravstveno stanje/i);
  });
});
