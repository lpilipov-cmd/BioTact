import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const localAdminEmail = "admin@biotact.local";
const e2eContactPrefix = "e2e.cart.";

function queryLocal<T>(sql: string): T[] {
  if (process.env.BIOTACT_E2E_LOCAL_SUPABASE !== "1") {
    throw new Error("Cart order E2E database access is allowed only against local Supabase.");
  }
  const output = execFileSync(
    resolve(process.cwd(), "node_modules/.bin/supabase"),
    ["db", "query", "--local", "--output", "json", sql],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  return (JSON.parse(output) as { rows: T[] }).rows;
}

function executeLocal(sql: string) {
  if (process.env.BIOTACT_E2E_LOCAL_SUPABASE !== "1") {
    throw new Error("Cart order E2E database access is allowed only against local Supabase.");
  }
  execFileSync(
    resolve(process.cwd(), "node_modules/.bin/supabase"),
    ["db", "query", "--local", sql],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
}

function removeE2EOrders() {
  executeLocal(`
    delete from public.leads
    where request_type = 'cart_order'
      and contact like '${e2eContactPrefix}%@example.invalid';
  `);
}

async function addProduct(page: Page, path: string, quantity: number) {
  await page.goto(path);
  for (let count = 0; count < quantity; count += 1) {
    await page.getByRole("button", { name: "Dodaj u korpu" }).click();
  }
}

async function authenticateLocalAdmin(page: Page) {
  if (process.env.BIOTACT_E2E_LOCAL_SUPABASE !== "1") {
    throw new Error("Local admin session creation is allowed only against local Supabase.");
  }
  const output = execFileSync(
    resolve(process.cwd(), "node_modules/.bin/supabase"),
    ["status", "--output", "json"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const status = JSON.parse(output) as { API_URL: string; ANON_KEY: string; SERVICE_ROLE_KEY: string };
  const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: localAdminEmail });
  if (linkError || !link.properties.hashed_token) throw linkError ?? new Error("Local admin link was not generated.");

  const anonymous = createClient(status.API_URL, status.ANON_KEY, { auth: { persistSession: false } });
  const { data, error } = await anonymous.auth.verifyOtp({
    type: "magiclink",
    token_hash: link.properties.hashed_token,
  });
  if (error || !data.session) throw error ?? new Error("Local admin session was not created.");

  await page.context().addCookies([{
    name: "sb-127-auth-token",
    value: `base64-${Buffer.from(JSON.stringify(data.session), "utf8").toString("base64url")}`,
    domain: "127.0.0.1",
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  }]);
}

test.beforeEach(async ({ page }) => {
  removeE2EOrders();
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("biotact-cart-v1"));
});

test.afterEach(() => {
  removeE2EOrders();
});

test("cart order creates one lead with all items and admin can inspect it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Database acceptance runs once in the desktop project.");
  const contact = `${e2eContactPrefix}${Date.now()}@example.invalid`;

  await addProduct(page, "/proizvodi/pro-12-kapsule-81180", 1);
  await addProduct(page, "/proizvodi/colostrum-liquid-80361", 2);
  await addProduct(page, "/proizvodi/cistus-incanus-kapsule-80325", 3);
  await page.getByRole("link", { name: "Korpa (6)" }).click();
  await page.getByRole("link", { name: "Nastavi na porudžbinu" }).click();

  await expect(page).toHaveURL(/\/porudzbina$/);
  await expect(page.getByRole("heading", { name: "Završi porudžbinu" })).toBeVisible();
  await expect(page.getByText("Pro 12+ kapsule", { exact: true })).toBeVisible();
  await expect(page.getByText("Colostrum Liquid", { exact: true })).toBeVisible();
  await expect(page.getByText("Cistus Incanus kapsule", { exact: true })).toBeVisible();

  await page.getByLabel("Ime i prezime").fill("E2E Cart Kupac");
  await page.getByLabel("Telefon ili email").fill(contact);
  await page.getByLabel("Napomena (opciono)").fill("Fiktivni lokalni E2E zahtev za porudžbinu.");
  await page.getByText("Saglasan/na sam", { exact: false }).click();
  await page.waitForTimeout(1_500);
  await page.getByRole("button", { name: "Pošalji porudžbinu" }).click();

  await expect(page.getByRole("heading", { name: "Hvala. Tvoja porudžbina je poslata." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Korpa (0)" })).toBeVisible();

  const leads = queryLocal<{ id: string; item_count: number; quantity_total: number }>(`
    select leads.id,
      count(lead_items.id)::int as item_count,
      sum(lead_items.quantity)::int as quantity_total
    from public.leads
    join public.lead_items on lead_items.lead_id = leads.id
    where leads.contact = '${contact}' and leads.request_type = 'cart_order'
    group by leads.id;
  `);
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({ item_count: 3, quantity_total: 6 });

  await authenticateLocalAdmin(page);
  await page.goto(`/admin/leads/${leads[0].id}`);
  await expect(page.getByRole("heading", { name: "E2E Cart Kupac" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Proizvodi u zahtevu" })).toBeVisible();
  for (const name of ["Pro 12+ kapsule", "Colostrum Liquid", "Cistus Incanus kapsule"]) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Informativno ukupno")).toBeVisible();
});

test("failed submission preserves cart and order page is responsive", async ({ page }) => {
  await addProduct(page, "/proizvodi/pro-12-kapsule-81180", 1);
  await page.goto("/porudzbina");
  await page.route("**/api/orders", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Kontrolisana E2E greška." }),
    });
  });

  await page.getByLabel("Ime i prezime").fill("E2E Neuspeh");
  await page.getByLabel("Telefon ili email").fill("e2e.failure@example.invalid");
  await page.getByText("Saglasan/na sam", { exact: false }).click();
  await page.getByRole("button", { name: "Pošalji porudžbinu" }).click();
  await expect(page.getByText("Kontrolisana E2E greška.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Korpa (1)" })).toBeVisible();

  for (const width of [1280, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await expect(page.getByRole("button", { name: "Pošalji porudžbinu" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pregled porudžbine" })).toBeVisible();
  }
});
