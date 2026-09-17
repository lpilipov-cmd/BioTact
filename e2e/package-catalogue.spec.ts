import { expect, test } from "@playwright/test";

test("javni katalog prikazuje samo četiri odobrena lokalna paketa", async ({ page }) => {
  await page.goto("/paketi");
  await expect(page.getByRole("heading", { name: "Paketi koji izbor čine jednostavnijim." })).toBeVisible();
  await expect(page.getByTestId("public-package-card")).toHaveCount(4);
  for (const name of ["Imunitet Start", "Creva & Energija", "Pokret & Snaga", "Srce & Cirkulacija"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  const firstPackage = page.getByTestId("public-package-card").first();
  await expect(firstPackage.getByText("Proizvodi u paketu")).toBeVisible();
  await expect(firstPackage.getByText("Colostrum Liquid")).toBeVisible();
  await expect(firstPackage.getByText("125 ml")).toBeVisible();
  await expect(page.getByText(/Privremeni paket|BIOTACT E2E paket/)).toHaveCount(0);

  await page.getByRole("link", { name: "Pogledaj paket Imunitet Start" }).click();
  await expect(page).toHaveURL(/\/paketi\/imunitet-start$/);
  await expect(page.getByRole("heading", { name: "Proizvodi u paketu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Colostrum Liquid" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cistus Incanus kapsule" })).toBeVisible();

  await page.goto("/paketi?category=imunitet");
  await expect(page.getByTestId("public-package-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Imunitet Start" })).toBeVisible();

  await page.goto("/paketi?category=nepoznato");
  await expect(page.getByTestId("public-package-card")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Sve kolekcije" })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByTestId("public-package-card").first().getByText("Proizvodi u paketu")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("neodobren ili nepostojeći paket vraća 404", async ({ page }) => {
  for (const slug of ["neodobreni-test-paket", "NEISPRAVAN SLUG", "nepostojeci-paket"]) {
    const response = await page.goto(`/paketi/${encodeURIComponent(slug)}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Paket nije pronađen." })).toBeVisible();
  }
});
