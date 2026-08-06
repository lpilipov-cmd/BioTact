import { expect, test, type Page } from "@playwright/test";

const localAdmin = {
  email: "admin@biotact.local",
  password: "Biotact-local-admin-2026!",
};

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localAdmin.email);
  await page.getByLabel("Lozinka").fill(localAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function fillPackageForm(
  page: Page,
  input: { name: string; slug: string; active?: boolean },
) {
  await page.getByLabel("Naziv").fill(input.name);
  await page.getByLabel("Slug").fill(input.slug);
  await page.getByLabel("Kategorija").selectOption("forma");
  await page.getByLabel("Cena (RSD)").fill("12990");
  await page.getByLabel("Redosled").fill("15");
  await page.getByLabel("Šifre proizvoda").fill("TEMP-E2E-001\nTEMP-E2E-002");
  await page
    .getByLabel("Opis")
    .fill("Neutralan lokalni opis koji podržava svakodnevnu wellness rutinu.");
  if (input.active === false) {
    await page.getByLabel("Aktivno i javno vidljivo").uncheck();
  }
}

test("neprijavljen korisnik ne može da pristupi admin paketima", async ({ page }) => {
  for (const path of ["/admin/packages", "/admin/packages/new"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
  }
});

test("administrator kreira i uređuje paket uz bezbednu validaciju", async ({
  page,
}, testInfo) => {
  const suffix = testInfo.project.name.replace(/[^a-z0-9]+/g, "-");
  const slug = `lokalni-e2e-${suffix}`;
  const updatedSlug = `${slug}-izmenjen`;

  await login(page);
  await page.goto("/admin/packages");
  await expect(page.getByRole("heading", { name: "Paketi" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Paketi", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(await page.getByTestId("admin-package-card").count()).toBeGreaterThanOrEqual(7);
  await expect(page.getByText("Privremeni paket - Neaktivan")).toBeVisible();
  await expect(page.getByRole("button", { name: /obriši/i })).toHaveCount(0);

  await page.goto("/admin/packages/new");
  await fillPackageForm(page, {
    name: "Lokalni duplikat",
    slug: "privremeni-imunitet",
  });
  await page.getByRole("button", { name: "Kreiraj paket" }).click();
  await expect(page.getByText("Paket sa ovim slugom već postoji.")).toBeVisible();

  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Naziv").fill(`Lokalni E2E paket ${suffix}`);
  await page.getByLabel("Aktivno i javno vidljivo").uncheck();

  await page.getByLabel("Opis").fill("Ovaj paket garantovano leči tegobe.");
  await expect(page.getByText("Opis sadrži rizičnu medicinsku tvrdnju.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Kreiraj paket" })).toBeDisabled();
  await page
    .getByLabel("Opis")
    .fill("Neutralan lokalni opis koji podržava svakodnevnu wellness rutinu.");
  await page.getByRole("button", { name: "Kreiraj paket" }).click();

  await expect(page).toHaveURL(/\/admin\/packages\/[0-9a-f-]+\?created=1$/);
  await expect(page.getByText("Paket je uspešno kreiran.")).toBeVisible();

  const editUrl = page.url().replace(/\?created=1$/, "");
  await page.getByLabel("Naziv").fill(`Izmenjeni E2E paket ${suffix}`);
  await page.getByLabel("Slug").fill(updatedSlug);
  await page.getByLabel("Kategorija").selectOption("pokret");
  await page.getByLabel("Cena (RSD)").fill("13990");
  await page.getByLabel("Redosled").fill("5");
  await page.getByLabel("Aktivno i javno vidljivo").check();
  await page.getByRole("button", { name: "Sačuvaj izmene" }).click();
  await expect(page.getByText("Paket je uspešno sačuvan.")).toBeVisible();

  await page.goto(`/paketi/${updatedSlug}`);
  await expect(page.getByRole("heading", { name: `Izmenjeni E2E paket ${suffix}` })).toBeVisible();
  await expect(page.getByText("13.990")).toBeVisible();
  await expect(page.getByText("Pokret", { exact: true })).toBeVisible();

  const packageBase = editUrl.slice(0, editUrl.lastIndexOf("/") + 1);
  for (const id of ["nije-uuid", "99999999-9999-4999-8999-999999999999"]) {
    const response = await page.goto(`${packageBase}${id}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Paket nije pronađen." })).toBeVisible();
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
