import { expect, test } from "@playwright/test";

const productPath = "/proizvodi/pro-12-kapsule-81180";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("biotact-cart-v1"));
});

test("kupac dodaje proizvod, nastavlja pregled i upravlja korpom", async ({ page }) => {
  await page.goto(productPath);
  await expect(page.getByRole("button", { name: "Dodaj u korpu" })).toBeVisible();
  await page.getByRole("button", { name: "Dodaj u korpu" }).click();

  await expect(page.getByRole("status")).toContainText("Proizvod je dodat u korpu.");
  await expect(page.getByRole("link", { name: "Korpa (1)" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Nastavi kupovinu" })).toHaveAttribute("href", "/proizvodi");

  await page.getByRole("button", { name: "Dodaj u korpu" }).click();
  await expect(page.getByRole("link", { name: "Korpa (2)" })).toBeVisible();
  await page.getByRole("link", { name: "Pogledaj korpu" }).click();

  await expect(page).toHaveURL(/\/korpa$/);
  await expect(page.getByRole("heading", { name: "Korpa", exact: true })).toBeVisible();
  await expect(page.getByText("Pro 12+ kapsule", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Količina za Pro 12+ kapsule").getByText("2", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Nastavi kupovinu" })).toHaveAttribute("href", "/proizvodi");
  await expect(page.getByRole("link", { name: "Nastavi na porudžbinu" })).toHaveAttribute("href", "/kontakt?source=cart");

  const storedItemKeys = await page.evaluate(() => {
    const stored = JSON.parse(window.localStorage.getItem("biotact-cart-v1") ?? "{}") as {
      items?: Record<string, unknown>[];
    };
    return Object.keys(stored.items?.[0] ?? {}).sort();
  });
  expect(storedItemKeys).toEqual(["id", "imagePath", "name", "priceEur", "quantity", "slug"]);

  await page.reload();
  await expect(page.getByRole("link", { name: "Korpa (2)" })).toBeVisible();
  await page.getByRole("button", { name: "Smanji količinu za Pro 12+ kapsule" }).click();
  await expect(page.getByLabel("Količina za Pro 12+ kapsule").getByText("1", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Smanji količinu za Pro 12+ kapsule" })).toBeDisabled();
  await page.getByRole("button", { name: "Ukloni" }).click();
  await expect(page.getByText("Korpa je prazna", { exact: true })).toBeVisible();
});

test("korpa nema horizontalno prelivanje na ciljanim širinama", async ({ page }) => {
  await page.goto("/korpa");

  for (const width of [1280, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await expect(page.getByRole("link", { name: "Pogledaj proizvode" })).toBeVisible();
  }
});
