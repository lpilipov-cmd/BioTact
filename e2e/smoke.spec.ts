import { expect, test } from "@playwright/test";

test("prikazuje kompletnu BIOTACT početnu stranicu i aktivne pakete", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("BIOTACT | Priroda. Nauka. Poverenje.");
  await expect(
    page.getByRole("heading", { level: 1, name: "Proizvodi za rutinu koja ima smisla." }),
  ).toBeVisible();
  await expect(
    page.getByText("Priroda. Nauka. Poverenje.", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lakši način da izabereš." })).toBeVisible();
  await expect(page.getByTestId("featured-package-card")).toHaveCount(4);
  await expect(page.getByText("Privremeni paket - Neaktivan")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Nisi siguran odakle da počneš?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Zašto BIOTACT?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pronađi rutinu koja ti odgovara." })).toBeVisible();

  const hero = page.getByRole("region", { name: "Proizvodi za rutinu koja ima smisla." });
  const finalCta = page.getByRole("region", { name: "Pronađi rutinu koja ti odgovara." });
  await expect(hero.getByRole("link", { name: "Istraži pakete" })).toHaveAttribute("href", "/paketi");
  await expect(hero.getByRole("link", { name: "Pogledaj proizvode" })).toHaveAttribute("href", "/proizvodi");
  await expect(finalCta.getByRole("link", { name: "Pogledaj proizvode" })).toHaveAttribute("href", "/proizvodi");
  await expect(finalCta.getByRole("link", { name: "Kontaktiraj nas" })).toHaveAttribute("href", "/kontakt");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
