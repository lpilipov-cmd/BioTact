import { expect, test } from "@playwright/test";

const localAdmin = {
  email: "admin@biotact.local",
  password: process.env.BIOTACT_E2E_ADMIN_PASSWORD ?? "Biotact-local-admin-2026!",
};

const localNonAdmin = {
  email: "korisnik@biotact.local",
  password: "Biotact-local-user-2026!",
};

test("neprijavljen korisnik se preusmerava na prijavu", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await expect(
    page.getByRole("heading", { name: "Administratorska prijava" }),
  ).toBeVisible();
});

test("prijavljen korisnik bez admin profila nema pristup", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localNonAdmin.email);
  await page.getByLabel("Lozinka").fill(localNonAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();

  await expect(
    page.getByText("Nalog nema administratorski pristup.", { exact: true }),
  ).toBeVisible();
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await page.goto("/admin/packages");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await page.goto("/admin/products/new");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});

test("administrator pristupa zaštićenoj strani i odjavljuje se", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localAdmin.email);
  await page.getByLabel("Lozinka").fill(localAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "BIOTACT administracija" }),
  ).toBeVisible();
  await expect(page.getByText(localAdmin.email)).toBeVisible();

  await page.goto("/admin/storefront-preview");
  await expect(page.getByRole("heading", { name: "Pametniji izbor za svakodnevni wellness." })).toBeVisible();
  await expect(page.getByText("Zaštićeni vlasnički pregled", { exact: true })).toBeVisible();
  await expect(page.getByTestId("featured-package-card")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Izdvojeni proizvodi" })).toBeVisible();
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText(/artikal\s+\d+/i)).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

  await page.goto("/admin/packages/preview");
  await expect(page.getByRole("heading", { name: "Paketi koji izbor čine jednostavnijim." })).toBeVisible();
  await expect(page.getByTestId("public-package-card")).toHaveCount(4);
  for (const name of ["Imunitet Start", "Creva & Energija", "Pokret & Snaga", "Srce & Cirkulacija"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await expect(page.getByText("Cena na upit")).toHaveCount(4);
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText(/80361-50|80325-50|81180-99|80205-650|80850-680|80190-50|80800-50|80338-699|80331-50/)).toHaveCount(0);
  await expect(page.locator(".package-composition[data-count='2']")).toHaveCount(3);
  await expect(page.locator(".package-composition[data-count='3']")).toHaveCount(1);
  for (const image of await page.locator(".package-composition img").all()) {
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }

  await page.getByRole("link", { name: "Pogledaj paket Pokret & Snaga" }).click();
  await expect(page).toHaveURL(/\/admin\/packages\/preview\/pokret-snaga$/);
  await expect(page.getByRole("heading", { name: "Pokret & Snaga" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Šta paket sadrži" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Pogledaj proizvod Aloe vera Freedom napitak" })).toHaveAttribute("href", "/admin/products/preview/aloe-vera-freedom-napitak-80850");
  await expect(page.getByRole("link", { name: "Pogledaj proizvod Active Freedom kapsule" })).toHaveAttribute("href", "/admin/products/preview/active-freedom-kapsule-80190");
  await expect(page.getByRole("link", { name: "Pošalji upit", exact: true })).toHaveAttribute("href", "/kontakt?package=pokret-snaga");
  await expect(page.getByText(/partnerska cena|poeni|80850-680|80190-50/i)).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  for (const width of [1280, 1024, 768, 375]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await expect(page.getByRole("link", { name: "Pošalji upit", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  }

  await page.goto("/admin/products/preview");
  await expect(page.getByRole("heading", { name: "BIOTACT katalog pre objave." })).toBeVisible();
  await expect(page.locator("[data-testid=product-grid] article")).toHaveCount(50);
  await expect(page.getByTestId("catalogue-collection-nav")).toBeVisible();
  await expect(page.locator('section[data-collection="aloe-vera"] article')).toHaveCount(14);
  await expect(page.locator('section[data-collection="digestija-i-ravnoteza"] article')).toHaveCount(5);
  await expect(page.locator('section[data-collection="imunitet"] article')).toHaveCount(3);
  await expect(page.locator('section[data-collection="energija-i-fokus"] article')).toHaveCount(7);
  await expect(page.locator('section[data-collection="srce-i-cirkulacija"] article')).toHaveCount(2);
  await expect(page.locator('section[data-collection="pokret-i-aktivan-zivot"] article')).toHaveCount(2);
  await expect(page.locator('section[data-collection="lepota-i-posebne-rutine"] article')).toHaveCount(3);
  await expect(page.locator('section[data-collection="body-mission"] article')).toHaveCount(14);
  await expect(page.getByTestId("missing-product-image")).toHaveCount(2);
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText(/artikal\s+\d+/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Pogledaj proizvod Aloe vera napitak sa medom$/i })).toBeVisible();
  await expect(page.getByText("MULTIPACK", { exact: true })).toHaveCount(8);
  await expect(page.getByText("3 × 1.000 ml", { exact: true })).toHaveCount(12);
  await expect(page.getByText("5 × 500 ml", { exact: true })).toHaveCount(2);
  await expect(page.getByText("5 × 500 ml — izbor Formula Green / Formula Red", { exact: true })).toHaveCount(2);

  await page.getByRole("button", { name: "Body Mission / FiguActive", exact: true }).click();
  await expect(page.locator("[data-testid=product-grid] article")).toHaveCount(14);
  await expect(page.getByRole("heading", { name: "Body Mission / FiguActive", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Svi proizvodi", exact: true }).click();
  await page.getByLabel("Pretražite proizvode").fill("Super Omega");
  await expect(page.locator("[data-testid=product-grid] article")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Pogledaj proizvod Super Omega 3 kapsule/i })).toBeVisible();
  await page.getByLabel("Pretražite proizvode").fill("nepostojeći proizvod");
  await expect(page.getByTestId("empty-product-catalogue")).toBeVisible();
  await page.getByRole("button", { name: "Prikaži sve proizvode" }).click();
  await expect(page.locator("[data-testid=product-grid] article")).toHaveCount(50);

  const choicePack = page.getByRole("link", { name: /Pogledaj proizvod Mind Master pakovanje od 5/i });
  await expect(choicePack.locator("img")).toHaveCount(2);
  await choicePack.click();
  await expect(page.getByText("Ponuda sadrži pet jedinica po slobodnom izboru Formula Green / Formula Red; fotografije prikazuju dostupne varijante, ne fiksnu kombinaciju.", { exact: true })).toBeVisible();
  await expect(page.getByText("126,54 €", { exact: true })).toBeVisible();
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText("Interna šifra artikla: 80935")).not.toBeVisible();
  await page.goto("/admin/products/preview");

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

  await page.getByRole("link", { name: "Pogledaj proizvod Aloe vera napitak sa medom", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/products\/preview\/aloe-vera-napitak-sa-medom-80700$/);
  await expect(page.getByRole("heading", { name: "Aloe vera napitak sa medom" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Pošalji upit" })).toHaveAttribute("href", "/kontakt?product=aloe-vera-napitak-sa-medom-80700");
  await expect(page.getByText("Interna šifra artikla: 80700")).not.toBeVisible();

  const productImage = page.locator(".product-detail-image img").first();
  await expect(productImage).toBeVisible();
  await expect.poll(() => productImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  for (const width of [1280, 1024, 768, 375]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await expect(page.getByRole("link", { name: "Pošalji upit" })).toBeVisible();

    const layout = await page.evaluate(() => {
      const image = document.querySelector<HTMLElement>(".product-detail-image")?.getBoundingClientRect();
      const information = document.querySelector<HTMLElement>(".product-detail-information")?.getBoundingClientRect();
      return {
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        image: image ? { left: image.left, right: image.right, top: image.top, bottom: image.bottom } : null,
        information: information ? { left: information.left, right: information.right, top: information.top, bottom: information.bottom } : null,
      };
    });

    expect(layout.hasHorizontalOverflow).toBe(false);
    expect(layout.image).not.toBeNull();
    expect(layout.information).not.toBeNull();
    if (width >= 1024) {
      expect(layout.image!.right).toBeLessThanOrEqual(layout.information!.left);
    } else {
      expect(layout.image!.bottom).toBeLessThanOrEqual(layout.information!.top);
    }
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Odjavi se" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});
