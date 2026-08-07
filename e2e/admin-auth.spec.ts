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
  await expect(page.getByRole("heading", { name: "Proizvodi koje vredi upoznati." })).toBeVisible();
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText(/artikal\s+\d+/i)).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

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

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Odjavi se" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});
