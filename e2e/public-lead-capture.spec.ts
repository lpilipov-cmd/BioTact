import { expect, test } from "@playwright/test";

test("kontakt forma validira podatke, preselektuje aktivan paket i prikazuje potvrdu", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    const request = route.request();
    expect(request.method()).toBe("POST");
    const body = request.postDataJSON() as Record<string, unknown>;
    expect(body.packageInterestId).toBe("10000000-0000-4000-8000-000000000001");
    expect(body.consent).toBe(true);
    expect(body).not.toHaveProperty("channel");
    expect(body).not.toHaveProperty("consentVersion");
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/kontakt?package=privremeni-imunitet");
  await expect(page.getByRole("heading", { name: "Pošaljite upit" })).toBeVisible();
  await expect(page.getByLabel("Paket (opciono)")).toHaveValue("10000000-0000-4000-8000-000000000001");

  await page.getByRole("button", { name: "Pošalji upit" }).click();
  await expect(page.getByText("Unesite ime i prezime.")).toBeVisible();
  await expect(page.getByText("Saglasnost je obavezna.")).toBeVisible();

  await page.getByLabel("Ime i prezime").fill("E2E Test Osoba");
  await page.getByLabel("Telefon ili email").fill("e2e@example.invalid");
  await page.getByLabel("Poruka (opciono)").fill("Fiktivni lokalni E2E upit.");
  await page.getByText("Saglasan/na sam", { exact: false }).click();
  await page.waitForTimeout(1_500);
  await page.getByRole("button", { name: "Pošalji upit" }).click();

  await expect(page.getByText("Hvala. Vaš upit je uspešno poslat.")).toBeVisible();
  await expect(page.getByText("Javićemo Vam se u najkraćem roku.")).toBeVisible();
  await expect(page.getByText(/lead ID/i)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("neaktivan ili nepoznat paket nije moguće preselektovati", async ({ page }) => {
  for (const slug of ["privremeni-neaktivan", "nepostojeci-paket"]) {
    await page.goto(`/kontakt?package=${slug}`);
    await expect(page.getByLabel("Paket (opciono)")).toHaveValue("");
    await expect(page.getByRole("option", { name: "Privremeni paket - Neaktivan" })).toHaveCount(0);
  }
});

test("detalj aktivnog paketa vodi na preselektovan kontakt", async ({ page }) => {
  await page.goto("/paketi/privremeni-imunitet");
  await page.locator("main").getByRole("link", { name: "Pošalji upit" }).click();
  await expect(page).toHaveURL(/\/kontakt\?package=privremeni-imunitet$/);
  await expect(page.getByLabel("Paket (opciono)")).toHaveValue("10000000-0000-4000-8000-000000000001");
});
