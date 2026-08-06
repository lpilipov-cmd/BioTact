import { expect, test } from "@playwright/test";

test("javni katalog prikazuje samo aktivne pakete i bezbedne filtere", async ({ page }) => {
  await page.goto("/paketi");
  await expect(page.getByRole("heading", { name: "Paketi" })).toBeVisible();
  await expect(page.getByText("Privremeni paket - Imunitet")).toBeVisible();
  await expect(page.getByText("Privremeni paket - Neaktivan")).toHaveCount(0);
  await expect(page.getByText("Cena na upit").first()).toBeVisible();

  await page.goto("/paketi?category=imunitet");
  await expect(page.getByTestId("public-package-card")).toHaveCount(1);
  await expect(page.getByText("Privremeni paket - Imunitet")).toBeVisible();

  await page.goto("/paketi?category=nepoznato");
  await expect(page.getByText("Privremeni paket - Imunitet")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("javni detalj prikazuje aktivan paket, a neaktivan vraća 404", async ({ page }) => {
  await page.goto("/paketi/privremeni-imunitet");
  await expect(page.getByRole("heading", { name: "Privremeni paket - Imunitet" })).toBeVisible();
  await expect(page.getByText("TEMP-IMUNITET-001")).toBeVisible();
  await expect(page.getByText("Važna napomena:")).toBeVisible();
  await expect(page.getByText("Cena na upit")).toBeVisible();

  for (const slug of ["privremeni-neaktivan", "NEISPRAVAN SLUG", "nepostojeci-paket"]) {
    const response = await page.goto(`/paketi/${encodeURIComponent(slug)}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Paket nije pronađen." })).toBeVisible();
  }
});
