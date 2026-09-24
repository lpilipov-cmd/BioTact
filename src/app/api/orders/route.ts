import { randomUUID } from "node:crypto";

import { getLeadRateLimitSalt } from "@/lib/env";
import { getRequestIp, hashRequestIp, isValidLeadFormProof } from "@/lib/leads/protection";
import { cartOrderSchema } from "@/lib/orders/validation";
import { createClient } from "@/lib/supabase/server";

const maximumBodyBytes = 16 * 1024;
const jsonHeaders = { "cache-control": "no-store" };

function json(message: string, status: number, extra?: Record<string, string | boolean>) {
  return Response.json({ ok: false, message, ...extra }, { status, headers: jsonHeaders });
}

async function readLimitedJson(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maximumBodyBytes) throw new Error("body_too_large");

  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBodyBytes) {
      await reader.cancel();
      throw new Error("body_too_large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json("Zahtev mora biti poslat kao JSON.", 415);
  }

  let body: unknown;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "body_too_large";
    return json(tooLarge ? "Zahtev je prevelik." : "Zahtev nije ispravan.", tooLarge ? 413 : 400);
  }

  const parsed = cartOrderSchema.safeParse(body);
  if (!parsed.success || parsed.data.website !== "") {
    return json("Proverite unete podatke i pokušajte ponovo.", 400);
  }

  let salt: string;
  try {
    salt = getLeadRateLimitSalt();
  } catch {
    const correlationId = randomUUID();
    console.error("Cart order configuration error", { correlationId });
    return json("Porudžbinu trenutno nije moguće poslati.", 500, { correlationId });
  }

  if (!isValidLeadFormProof(parsed.data.formStartedAt, parsed.data.formToken, salt)) {
    return json("Proverite unete podatke i pokušajte ponovo.", 400);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_cart_lead", {
    p_name: parsed.data.name,
    p_contact: parsed.data.contact,
    p_consent_given: true,
    p_ip_hash: hashRequestIp(getRequestIp(request.headers), salt),
    p_idempotency_key: parsed.data.idempotencyKey,
    p_items: parsed.data.items,
    p_message: parsed.data.message,
  });

  if (!error) return Response.json({ ok: true }, { headers: jsonHeaders });
  if (error.code === "P0001" && error.message.includes("rate_limit_exceeded")) {
    return json("Poslali ste više zahteva. Pokušajte ponovo za deset minuta.", 429);
  }
  if (error.code === "22023") {
    return json("Proverite proizvode i unete podatke, pa pokušajte ponovo.", 400);
  }

  const correlationId = randomUUID();
  console.error("Cart order submission failed", { correlationId, code: error.code });
  return json("Porudžbinu trenutno nije moguće poslati.", 500, { correlationId });
}

function methodNotAllowed() {
  return Response.json(
    { ok: false, message: "Metod nije podržan." },
    { status: 405, headers: { ...jsonHeaders, allow: "POST" } },
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
