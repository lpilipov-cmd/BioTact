import { expect, test } from "@playwright/test";

test("neispravna prijava prikazuje bezbednu poruku", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email adresa").fill("pogresan@example.invalid");
  await page.getByLabel("Lozinka").fill("pogresna-lozinka");
  await page.getByRole("button", { name: "Prijavi se" }).click();

  await expect(
    page.getByText("Email ili lozinka nisu ispravni.", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);
});
