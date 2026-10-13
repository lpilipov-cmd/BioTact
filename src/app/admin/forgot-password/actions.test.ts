import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

import { requestPasswordRecoveryAction } from "./actions";

vi.mock("@/lib/env", () => ({
  getSiteUrl: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockedGetSiteUrl = vi.mocked(getSiteUrl);
const mockedCreateClient = vi.mocked(createClient);

describe("zahtev za oporavak administratorske lozinke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetSiteUrl.mockReturnValue("https://bio-tact.vercel.app");
  });

  it("prosleđuje tačan produkcioni callback Supabase Auth-u", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({
      auth: { resetPasswordForEmail },
    } as never);
    const formData = new FormData();
    formData.set("email", "admin@example.com");

    const state = await requestPasswordRecoveryAction(
      { message: null, success: false },
      formData,
    );

    expect(resetPasswordForEmail).toHaveBeenCalledWith("admin@example.com", {
      redirectTo: "https://bio-tact.vercel.app/admin/auth/callback",
    });
    expect(state.success).toBe(true);
  });

  it("ne zapisuje email, tokene ili lozinke u konzolu", async () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedCreateClient.mockResolvedValue({
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never);
    const formData = new FormData();
    formData.set("email", "admin@example.com");

    await requestPasswordRecoveryAction(
      { message: null, success: false },
      formData,
    );

    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    consoleLog.mockRestore();
    consoleError.mockRestore();
  });
});
