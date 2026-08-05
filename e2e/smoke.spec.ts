import { expect, test } from "@playwright/test";

test("prikazuje BIOTACT početnu stranicu", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("BIOTACT");
  await expect(
    page.getByRole("heading", { level: 1, name: "BIOTACT" }),
  ).toBeVisible();
  await expect(
    page.getByText("Tehnička osnova platforme je uspešno inicijalizovana."),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
