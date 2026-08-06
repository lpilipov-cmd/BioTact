import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

const minimumCompletionTimeMs = 1_500;
const maximumFormAgeMs = 2 * 60 * 60 * 1_000;

function signature(startedAt: number, salt: string) {
  return createHmac("sha256", salt).update(`lead-form:${startedAt}`).digest("hex");
}

export function createLeadFormProof(salt: string, now = Date.now()) {
  return { formStartedAt: now, formToken: signature(now, salt) };
}

export function isValidLeadFormProof(
  startedAt: number,
  token: string,
  salt: string,
  now = Date.now(),
) {
  const age = now - startedAt;
  if (age < minimumCompletionTimeMs || age > maximumFormAgeMs) return false;

  const expected = signature(startedAt, salt);
  if (token.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function getRequestIp(headers: Headers) {
  const candidate =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("x-forwarded-for")?.split(",")[0] ??
    headers.get("x-real-ip");
  const normalized = candidate?.trim();
  return normalized && isIP(normalized) ? normalized : "unknown";
}

export function hashRequestIp(ip: string, salt: string) {
  return createHmac("sha256", salt).update(`lead-ip:${ip}`).digest("hex");
}
