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

  await page.goto("/kontakt?package=imunitet-start");
  await expect(page.getByRole("heading", { name: "Tu smo da ti pomognemo da napraviš sledeći korak." })).toBeVisible();
  await expect(page.getByLabel("Upit za: Imunitet Start")).toContainText("Imunitet Start");
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

  await expect(page.getByText("Hvala. Tvoj upit je uspešno poslat.")).toBeVisible();
  await expect(page.getByText("Javićemo se u najkraćem roku putem kontakta koji si ostavio/la.")).toBeVisible();
  await expect(page.getByText(/lead ID/i)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("nepoznat paket nije moguće preselektovati", async ({ page }) => {
  for (const slug of ["neodobreni-test-paket", "nepostojeci-paket"]) {
    await page.goto(`/kontakt?package=${slug}`);
    await expect(page.getByLabel("Paket (opciono)")).toHaveValue("");
  }
});

test("kontakt parametar aktivnog paketa ostaje preselektovan", async ({ page }) => {
  await page.goto("/kontakt?package=imunitet-start");
  await expect(page).toHaveURL(/\/kontakt\?package=imunitet-start$/);
  await expect(page.getByLabel("Paket (opciono)")).toHaveValue("10000000-0000-4000-8000-000000000001");
});
