import { describe, expect, it } from "vitest";

import { createLeadFormProof, getRequestIp, hashRequestIp, isValidLeadFormProof } from "./protection";

const salt = "test-only-lead-rate-limit-salt-123456789";

describe("lead anti-spam protection", () => {
  it("prihvata potpis forme tek nakon realnog vremena popunjavanja", () => {
    const proof = createLeadFormProof(salt, 10_000);
    expect(isValidLeadFormProof(proof.formStartedAt, proof.formToken, salt, 11_499)).toBe(false);
    expect(isValidLeadFormProof(proof.formStartedAt, proof.formToken, salt, 11_500)).toBe(true);
  });

  it("odbija izmenjen i istekao dokaz", () => {
    const proof = createLeadFormProof(salt, 10_000);
    expect(isValidLeadFormProof(proof.formStartedAt, "0".repeat(64), salt, 12_000)).toBe(false);
    expect(isValidLeadFormProof(proof.formStartedAt, proof.formToken, salt, 10_000 + 2 * 60 * 60 * 1000 + 1)).toBe(false);
  });

  it("uzima Vercel IP, validira ga i čuva samo stabilan HMAC", () => {
    const headers = new Headers({ "x-vercel-forwarded-for": "203.0.113.9" });
    expect(getRequestIp(headers)).toBe("203.0.113.9");
    expect(hashRequestIp(getRequestIp(headers), salt)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashRequestIp("203.0.113.9", salt)).not.toContain("203.0.113.9");
  });

  it("ne prihvata proizvoljan IP header kao adresu", () => {
    expect(getRequestIp(new Headers({ "x-forwarded-for": "nije-ip" }))).toBe("unknown");
  });
});
