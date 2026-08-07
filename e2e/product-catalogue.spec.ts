import { expect, test } from "@playwright/test";

test("prazan katalog proizvoda je bezbedan, upotrebljiv i responzivan", async ({
  page,
}) => {
  await page.goto("/proizvodi");

  await expect(page.getByRole("heading", { name: "Proizvodi" })).toBeVisible();
  await expect(page.getByTestId("empty-product-catalogue")).toBeVisible();
  await expect(page.getByText("Katalog proizvoda je u pripremi.")).toBeVisible();
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
  await expect(page.getByText(/artikal\s+\d+/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pošalji opšti upit" })).toHaveAttribute(
    "href",
    "/kontakt",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("zaštićeni pregled ne može anonimno da se otvori", async ({ page }) => {
  await page.goto("/admin/products/preview");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);

  await page.goto("/admin/storefront-preview");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});
