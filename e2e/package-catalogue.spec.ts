import { expect, test } from "@playwright/test";

test("javni katalog ne prikazuje neodobrene lokalne pakete", async ({ page }) => {
  await page.goto("/paketi");
  await expect(page.getByRole("heading", { name: "Paketi koji izbor čine jednostavnijim." })).toBeVisible();
  await expect(page.getByTestId("public-package-card")).toHaveCount(0);
  await expect(page.getByText("Nema aktivnih paketa u ovoj kategoriji.")).toBeVisible();
  await expect(page.getByText(/Privremeni paket|Lokalni E2E paket/)).toHaveCount(0);

  await page.goto("/paketi?category=imunitet");
  await expect(page.getByTestId("public-package-card")).toHaveCount(0);
  await expect(page.getByText("Nema aktivnih paketa u ovoj kategoriji.")).toBeVisible();

  await page.goto("/paketi?category=nepoznato");
  await expect(page.getByText("Nema aktivnih paketa u ovoj kategoriji.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("neodobren, neaktivan ili nepostojeći paket vraća 404", async ({ page }) => {
  for (const slug of ["privremeni-imunitet", "privremeni-neaktivan", "NEISPRAVAN SLUG", "nepostojeci-paket"]) {
    const response = await page.goto(`/paketi/${encodeURIComponent(slug)}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Paket nije pronađen." })).toBeVisible();
  }
});
