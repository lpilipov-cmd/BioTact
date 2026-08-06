import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const salt = "route-test-only-salt-123456789012345";

vi.mock("@/lib/env", () => ({ getLeadRateLimitSalt: () => salt }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

import { DELETE, GET, POST } from "./route";
import { createLeadFormProof } from "@/lib/leads/protection";

function validBody() {
  const now = Date.now();
  return {
    name: "Test Osoba",
    contact: "test@example.invalid",
    consent: true,
    website: "",
    idempotencyKey: "80000000-0000-4000-8000-000000000001",
    ...createLeadFormProof(salt, now - 2_000),
  };
}

function request(body: unknown, headers?: Record<string, string>) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    rpc.mockReset();
    rpc.mockResolvedValue({ data: true, error: null });
  });

  it("prosleđuje validiran upit ograničenom RPC-u bez lead ID odgovora", async () => {
    const response = await POST(request(validBody()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith("submit_lead", expect.objectContaining({
      p_consent_given: true,
      p_contact: "test@example.invalid",
      p_ip_hash: expect.stringMatching(/^[0-9a-f]{64}$/),
    }));
    expect(JSON.stringify(rpc.mock.calls)).not.toContain("203.0.113.10");
  });

  it("odbija honeypot i prebrzo popunjavanje pre baze", async () => {
    expect((await POST(request({ ...validBody(), website: "bot.example" }))).status).toBe(400);
    const fastProof = createLeadFormProof(salt);
    expect((await POST(request({ ...validBody(), ...fastProof }))).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("ograničava tip i veličinu tela", async () => {
    const wrongType = new Request("http://localhost/api/leads", { method: "POST", body: "{}" });
    expect((await POST(wrongType)).status).toBe(415);
    expect((await POST(request({ value: "a".repeat(17_000) }))).status).toBe(413);
  });

  it("mapira ograničenje baze na bezbedan 429 odgovor", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "P0001", message: "rate_limit_exceeded" } });
    const response = await POST(request(validBody()));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Poslali ste više upita. Pokušajte ponovo za deset minuta.",
    });
  });

  it("vraća JSON 405 za nepodržane metode", async () => {
    for (const handler of [GET, DELETE]) {
      const response = handler();
      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("POST");
      expect(response.headers.get("content-type")).toContain("application/json");
    }
  });
});
