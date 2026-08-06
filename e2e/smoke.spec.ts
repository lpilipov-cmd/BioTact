import { expect, test } from "@playwright/test";

test("prikazuje kompletnu BIOTACT početnu stranicu i aktivne pakete", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("BIOTACT | Priroda. Nauka. Poverenje.");
  await expect(
    page.getByRole("heading", { level: 1, name: "BIOTACT" }),
  ).toBeVisible();
  await expect(
    page.getByText("Priroda. Nauka. Poverenje.", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Izdvojeni paketi" })).toBeVisible();
  await expect(page.getByTestId("featured-package-card")).toHaveCount(3);
  await expect(page.getByText("Privremeni paket - Neaktivan")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Kako funkcioniše" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Informacije bez nerealnih obećanja" })).toBeVisible();

  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "Pogledaj pakete" })).toHaveAttribute("href", "/paketi");
  await expect(main.getByRole("link", { name: "Pošalji upit" }).first()).toHaveAttribute("href", "/kontakt");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
