import { expect, test } from "@playwright/test";

test("prazan katalog proizvoda je bezbedan, upotrebljiv i responzivan", async ({
  page,
}) => {
  await page.goto("/proizvodi");

  await expect(page.getByRole("heading", { name: "Proizvodi" })).toBeVisible();
  await expect(page.getByTestId("empty-product-catalogue")).toBeVisible();
  await expect(page.getByText("Katalog proizvoda je u pripremi.")).toBeVisible();
  await expect(page.getByLabel("Naziv ili šifra")).toBeVisible();
  await expect(page.locator('select[name="category"]')).toBeVisible();
  await expect(page.getByLabel("Potkategorija")).toBeVisible();
  await expect(page.getByText(/partnerska cena|poeni/i)).toHaveCount(0);
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

test("filteri proizvoda ostaju u URL-u i bez rezultata prikazuju neutralno stanje", async ({
  page,
}) => {
  await page.goto("/proizvodi");
  await page.getByLabel("Naziv ili šifra").fill("80700");
  await page.locator('select[name="category"]').selectOption("zdravlje");
  await page.getByLabel("Potkategorija").fill("Aloe Vera");
  await page.getByRole("button", { name: "Primeni filtere" }).click();

  await expect(page).toHaveURL(
    /\/proizvodi\?q=80700&category=zdravlje&subcategory=Aloe\+Vera$/,
  );
  await expect(page.getByTestId("empty-product-catalogue")).toBeVisible();
});
