import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/paketi", "/paketi/privremeni-imunitet", "/proizvodi", "/kontakt", "/o-nama"];

test("zajednički javni shell povezuje sve rute bez admin navigacije", async ({ page }, testInfo) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: "BIOTACT početna" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigacija u podnožju" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Administracija" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Leadovi" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  }

  await page.goto("/");
  if (testInfo.project.name === "mobile-375") {
    await page.getByRole("button", { name: "Otvori meni" }).click();
  }
  const navigation = page.getByRole("navigation", {
    name: testInfo.project.name === "mobile-375" ? "Mobilna navigacija" : "Glavna navigacija",
  });
  for (const [label, href] of [["Početna", "/"], ["Paketi", "/paketi"], ["Proizvodi", "/proizvodi"], ["O nama", "/o-nama"], ["Kontakt", "/kontakt"]] as const) {
    await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  await expect(navigation.getByRole("link", { name: "Pošalji upit" })).toHaveAttribute("href", "/kontakt");
});

test("mobilni meni radi tastaturom na 375px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375", "Provera je namenjena mobilnom projektu.");
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pređi na glavni sadržaj" })).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const menuButton = page.getByRole("button", { name: "Otvori meni" });
  await expect(menuButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobilna navigacija" })).toBeVisible();
  await page.getByRole("navigation", { name: "Mobilna navigacija" }).getByRole("link", { name: "O nama" }).click();
  await expect(page).toHaveURL(/\/o-nama$/);
  await expect(page.getByRole("button", { name: "Otvori meni" })).toHaveAttribute("aria-expanded", "false");
});

test("paket kartice i CTA dugmad vode na postojeće javne tokove", async ({ page }) => {
  await page.goto("/");
  const featuredCard = page.getByTestId("featured-package-card").first();
  const href = await featuredCard.getByRole("link", { name: "Pogledaj paket" }).getAttribute("href");
  expect(href).toMatch(/^\/paketi\/[a-z0-9-]+$/);
  await featuredCard.getByRole("link", { name: "Pogledaj paket" }).click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  await page.goto("/");
  await page.locator("main").getByRole("link", { name: "Pogledaj pakete" }).click();
  await expect(page).toHaveURL(/\/paketi$/);
  await page.goto("/");
  await page.locator("main").getByRole("link", { name: "Pošalji upit" }).first().click();
  await expect(page).toHaveURL(/\/kontakt$/);
});

test("o nama transparentno opisuje LR odnos bez prodajnih ili zdravstvenih obećanja", async ({ page }) => {
  await page.goto("/o-nama");
  await expect(page.getByText("BIOTACT nije proizvođač tih proizvoda.")).toBeVisible();
  await expect(page.getByText("LR Health & Beauty", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("odgovarajući LR proces", { exact: false })).toBeVisible();
  await expect(page.getByText(/garantovan[ae] zarad|leči bolesti/i)).toHaveCount(0);
  await expect(page.getByText(/testimonials|svedočenja kupaca/i)).toHaveCount(0);
});

test("javni sajt nema korpu ili checkout i objavljuje SEO rute", async ({ page, request }) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: /korpa|checkout|plati/i })).toHaveCount(0);
  }

  await page.goto("/o-nama");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/o-nama$/);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin/");
  const sitemap = await request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("/o-nama");
  expect(sitemapText).toContain("/proizvodi");
  expect(sitemapText).toContain("/paketi/privremeni-imunitet");
  expect(sitemapText).not.toContain("/admin");
});
