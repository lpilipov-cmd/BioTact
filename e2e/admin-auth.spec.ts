import { expect, test } from "@playwright/test";

const localAdmin = {
  email: "admin@biotact.local",
  password: "Biotact-local-admin-2026!",
};

const localNonAdmin = {
  email: "korisnik@biotact.local",
  password: "Biotact-local-user-2026!",
};

test("neprijavljen korisnik se preusmerava na prijavu", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await expect(
    page.getByRole("heading", { name: "Administratorska prijava" }),
  ).toBeVisible();
});

test("prijavljen korisnik bez admin profila nema pristup", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localNonAdmin.email);
  await page.getByLabel("Lozinka").fill(localNonAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();

  await expect(
    page.getByText("Nalog nema administratorski pristup.", { exact: true }),
  ).toBeVisible();
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  await page.goto("/admin/packages");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});

test("administrator pristupa zaštićenoj strani i odjavljuje se", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localAdmin.email);
  await page.getByLabel("Lozinka").fill(localAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "BIOTACT administracija" }),
  ).toBeVisible();
  await expect(page.getByText(localAdmin.email)).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Odjavi se" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});
