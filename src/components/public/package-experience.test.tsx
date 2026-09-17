import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { approvedPackagePresentations } from "@/lib/packages/presentation";

import { PackageCard } from "./package-card";
import { PackageDetail } from "./package-detail";

describe("premium prikaz paketa", () => {
  it("kartica prikazuje svaki proizvod, sadržaj pakovanja i dostupne veze", () => {
    const packageData = approvedPackagePresentations[0];
    const html = renderToStaticMarkup(<PackageCard packageData={packageData} linkedProductSlugs={new Set(packageData.products.map((product) => product.slug))} />);

    expect(html).toContain("Imunitet Start");
    expect(html).toContain("2 proizvoda");
    expect(html).toContain("Cena na upit");
    expect(html).toContain("Proizvodi u paketu");
    expect(html).toContain("Colostrum Liquid");
    expect(html).toContain("125 ml");
    expect(html).toContain("%2Fproducts%2F80361%2Fproduct.webp");
    expect(html).toContain('href="/paketi/imunitet-start"');
    expect(html).toContain('href="/proizvodi/colostrum-liquid-80361"');
    expect(html).not.toMatch(/partnerska cena|poeni/i);
    expect(html).not.toContain("80361-50");
  });

  it("detalj čuva paket u kontakt upitu i linkuje samo dostupne proizvode", () => {
    const packageData = approvedPackagePresentations[2];
    const html = renderToStaticMarkup(
      <PackageDetail
        packageData={{ ...packageData, products: packageData.products.map((product) => ({ ...product, cataloguePriceEur: 49.9 })) }}
        linkedProductSlugs={new Set(["aloe-vera-freedom-napitak-80850", "active-freedom-kapsule-80190"])}
        productDetailBasePath="/admin/products/preview"
        preview
      />,
    );

    expect(html).toContain('href="/kontakt?package=pokret-snaga"');
    expect(html).toContain('href="/admin/products/preview/aloe-vera-freedom-napitak-80850"');
    expect(html).toContain('href="/admin/products/preview/active-freedom-kapsule-80190"');
    expect(html).toContain("Proizvodi u paketu");
    expect(html).toContain("49,90");
    expect(html).toContain("Zašto je ovaj paket organizovan ovako");
    expect(html).not.toMatch(/partnerska cena|poeni|80850-680|80190-50/i);
  });
});
