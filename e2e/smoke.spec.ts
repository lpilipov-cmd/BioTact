import { expect, test } from "@playwright/test";

test("prikazuje kompletnu BIOTACT početnu stranicu i aktivne pakete", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("BIOTACT | Priroda. Nauka. Poverenje.");
  await expect(
    page.getByRole("heading", { level: 1, name: "Pametniji izbor za svakodnevni wellness." }),
  ).toBeVisible();
  await expect(
    page.getByText("Priroda. Nauka. Poverenje.", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lakši put od izbora do razgovora." })).toBeVisible();
  await expect(page.getByTestId("featured-package-card")).toHaveCount(4);
  await expect(page.getByText("Privremeni paket - Neaktivan")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Nisi siguran šta da izabereš?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Više jasnoće. Manje buke." })).toBeVisible();

  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "Pogledaj pakete" })).toHaveAttribute("href", "/paketi");
  await expect(main.getByRole("link", { name: "Pronađi proizvod" })).toHaveAttribute("href", "/proizvodi");
  await expect(main.getByRole("link", { name: "Kontaktiraj nas" })).toHaveAttribute("href", "/kontakt");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
