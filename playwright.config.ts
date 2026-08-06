import { defineConfig, devices } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

function getLocalSupabaseEnvironment(): Record<string, string> {
  if (process.env.BIOTACT_E2E_LOCAL_SUPABASE !== "1") {
    return {};
  }

  const output = execFileSync(
    resolve(process.cwd(), "node_modules/.bin/supabase"),
    ["status", "--output", "env"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const values = Object.fromEntries(
    output
      .split("\n")
      .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], match[2]]),
  );
  const url = values.API_URL;
  const key = values.PUBLISHABLE_KEY ?? values.ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Lokalni Supabase URL i javni ključ nisu dostupni za E2E testove.",
    );
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  };
}

const localSupabaseEnvironment = getLocalSupabaseEnvironment();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-375",
      use: {
        ...devices["iPhone 13 Mini"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    env: localSupabaseEnvironment,
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
