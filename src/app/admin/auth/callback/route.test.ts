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

  it("razmenjuje kod, proverava admin mapiranje i koristi fiksno interno odredište", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { id: "admin-user-id" } },
      error: null,
    });
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { user_id: "admin-user-id" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });

    mockedCreateClient.mockResolvedValue({
      auth: { exchangeCodeForSession, getUser },
      from: vi.fn().mockReturnValue({ select }),
    } as never);

    const response = await GET(
      new NextRequest(
        "https://bio-tact.vercel.app/admin/auth/callback?code=fresh-code&next=https://evil.example",
      ),
    );

    expect(exchangeCodeForSession).toHaveBeenCalledWith("fresh-code");
    expect(eq).toHaveBeenCalledWith("user_id", "admin-user-id");
    expect(response.headers.get("location")).toBe(
      "https://bio-tact.vercel.app/admin/reset-password",
    );
  });

  it("ne pušta autentifikovanog korisnika bez admin mapiranja na reset", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "non-admin-user-id" } },
          error: null,
        }),
        signOut,
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    } as never);

    const response = await GET(
      new NextRequest(
        "https://bio-tact.vercel.app/admin/auth/callback?code=non-admin-code",
      ),
    );

    expect(signOut).toHaveBeenCalledOnce();
    expect(response.headers.get("location")).toBe(
      "https://bio-tact.vercel.app/admin/forgot-password?status=invalid",
    );
  });
});
