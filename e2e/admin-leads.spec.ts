import { expect, test, type Page } from "@playwright/test";

const localAdmin = {
  email: "admin@biotact.local",
  password: process.env.BIOTACT_E2E_ADMIN_PASSWORD ?? "Biotact-local-admin-2026!",
};

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill(localAdmin.email);
  await page.getByLabel("Lozinka").fill(localAdmin.password);
  await page.getByRole("button", { name: "Prijavi se" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("neprijavljen korisnik ne može da pristupi leadovima", async ({ page }) => {
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login\?reason=pristup$/);
});

test("administrator upravlja leadovima bezbedno i u responsive prikazu", async ({ page }) => {
  await login(page);
  await page.goto("/admin/leads");

  await expect(page.getByRole("heading", { name: "Leadovi" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Leadovi", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const cards = page.getByTestId("lead-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toContainText("Test Osoba Jedan");
  await expect(cards.last()).toContainText("Test Osoba Četiri");
  await expect(page.getByRole("button", { name: /obriši/i })).toHaveCount(0);

  await page.goto("/admin/leads?status=kontaktiran&channel=instagram");
  await expect(page.getByTestId("lead-card")).toHaveCount(1);
  await expect(page.getByTestId("lead-card")).toContainText("Test Osoba Dva");

  await page.goto("/admin/leads?status=izgubljen");
  await expect(
    page.getByRole("heading", { name: "Nema leadova za izabrane filtere." }),
  ).toBeVisible();

  await page.goto("/admin/leads?status=obrisan&channel=nepoznat");
  await expect(page.getByTestId("lead-card")).toHaveCount(4);

  await page.goto("/admin/leads/20000000-0000-4000-8000-000000000001");
  await expect(page.getByRole("heading", { name: "Test Osoba Jedan" })).toBeVisible();
  await expect(page.getByText("Fiktivni lokalni upit", { exact: false })).toBeVisible();
  await expect(page.getByText("local-test-v1")).toBeVisible();
  const whatsapp = page.getByRole("link", { name: "Otvori WhatsApp" });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me\/381601112233\?text=/);
  expect(decodeURIComponent((await whatsapp.getAttribute("href")) ?? "")).toContain(
    "Zdravo Test Osoba Jedan, javljamo Vam se povodom Vašeg BIOTACT upita",
  );

  await page.getByLabel("Status leada").selectOption("kontaktiran");
  await page.getByRole("button", { name: "Sačuvaj" }).click();
  await expect(page.getByRole("status")).toHaveText("Status je uspešno sačuvan.");
  await expect(page.getByText("060 111 22 33")).toBeVisible();

  await page.goto("/admin/leads/20000000-0000-4000-8000-000000000002");
  await expect(page.getByRole("link", { name: "Pošalji email" })).toHaveAttribute(
    "href",
    "mailto:test.osoba.dva%40example.invalid",
  );
  await expect(page.getByRole("link", { name: "Otvori WhatsApp" })).toHaveCount(0);

  for (const id of ["nije-uuid", "99999999-9999-4999-8999-999999999999"]) {
    const response = await page.goto(`/admin/leads/${id}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Lead nije pronađen." })).toBeVisible();
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
