import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

describe("administratorski recovery callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("odbija callback bez koda bez pokretanja Auth razmene", async () => {
    const response = await GET(
      new NextRequest("https://bio-tact.vercel.app/admin/auth/callback"),
    );

    expect(response.headers.get("location")).toBe(
      "https://bio-tact.vercel.app/admin/forgot-password?status=invalid",
    );
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("bezbedno odbija nevažeći ili istekao kod", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi
          .fn()
          .mockResolvedValue({ error: new Error("invalid code") }),
      },
    } as never);

    const response = await GET(
      new NextRequest(
        "https://bio-tact.vercel.app/admin/auth/callback?code=invalid",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://bio-tact.vercel.app/admin/forgot-password?status=invalid",
    );
  });
});
