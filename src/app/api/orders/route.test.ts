import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
const salt = "route-test-only-salt-123456789012345";

vi.mock("@/lib/env", () => ({ getLeadRateLimitSalt: () => salt }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ rpc }) }));

import { GET, POST } from "./route";
import { createLeadFormProof } from "@/lib/leads/protection";

function validBody() {
  return {
    name: "Test Osoba",
    contact: "test@example.invalid",
    consent: true,
    website: "",
    idempotencyKey: "80000000-0000-4000-8000-000000000001",
    items: [{ productId: "70000000-0000-4000-8000-000000000001", quantity: 2 }],
    ...createLeadFormProof(salt, Date.now() - 2_000),
  };
}

function request(body: unknown) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/orders", () => {
  beforeEach(() => {
    rpc.mockReset();
    rpc.mockResolvedValue({ data: true, error: null });
  });

  it("sends only validated customer data and product identifiers to the cart RPC", async () => {
    const response = await POST(request(validBody()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith("submit_cart_lead", expect.objectContaining({
      p_consent_given: true,
      p_items: [{ productId: "70000000-0000-4000-8000-000000000001", quantity: 2 }],
      p_ip_hash: expect.stringMatching(/^[0-9a-f]{64}$/),
    }));
    expect(JSON.stringify(rpc.mock.calls)).not.toContain("203.0.113.10");
  });

  it("rejects forged public values, empty carts and honeypots before the database", async () => {
    expect((await POST(request({ ...validBody(), items: [] }))).status).toBe(400);
    expect((await POST(request({ ...validBody(), website: "bot.example" }))).status).toBe(400);
    expect((await POST(request({
      ...validBody(),
      items: [{ ...validBody().items[0], priceEur: 0.01 }],
    }))).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("maps database rate limits and invalid cart products to safe responses", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: "P0001", message: "rate_limit_exceeded" } });
    expect((await POST(request(validBody()))).status).toBe(429);
    rpc.mockResolvedValueOnce({ data: null, error: { code: "22023", message: "invalid_cart_product" } });
    expect((await POST(request(validBody()))).status).toBe(400);
  });

  it("allows only POST", async () => {
    expect(GET().status).toBe(405);
  });
});
