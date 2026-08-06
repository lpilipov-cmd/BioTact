import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FeaturedPackages } from "./featured-packages";

describe("FeaturedPackages", () => {
  it("prikazuje neutralno stanje bez izmišljenih podataka", () => {
    const html = renderToStaticMarkup(<FeaturedPackages packages={[]} />);
    expect(html).toContain("Paketi će uskoro biti dostupni.");
    expect(html).toContain("samo proverene informacije");
    expect(html).toContain('href="/kontakt"');
    expect(html).not.toMatch(/din|RSD|šifra|garantovano/i);
  });
});
