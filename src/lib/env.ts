import { z } from "zod";

const optionalValue = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const environmentSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: optionalValue(z.url()),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalValue(
      z.string().min(20),
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalValue(z.string().min(20)),
    NEXT_PUBLIC_WHATSAPP_NUMBER: optionalValue(z.string().min(8).max(20)),
    NEXT_PUBLIC_SITE_URL: optionalValue(z.url()),
    LEAD_RATE_LIMIT_SALT: optionalValue(z.string().min(32)),
  })
  .refine(
    ({
      NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }) =>
      Boolean(NEXT_PUBLIC_SUPABASE_URL) ===
      Boolean(
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
          NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
    {
      message:
        "Supabase URL i javni ključ moraju biti podešeni zajedno.",
      path: ["NEXT_PUBLIC_SUPABASE_URL"],
    },
  )
  .refine(
    ({
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }) =>
      !(
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
        NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    {
      message:
        "Podesite samo jedan Supabase javni ključ.",
      path: ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
    },
  );

export function validateEnvironment(
  input: Record<string, string | undefined>,
) {
  return environmentSchema.parse(input);
}

export function requireSupabaseEnvironment(
  input: ReturnType<typeof validateEnvironment>,
) {
  if (
    !input.NEXT_PUBLIC_SUPABASE_URL ||
    !(
      input.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      input.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  ) {
    throw new Error(
      "Supabase javne promenljive okruženja nisu podešene.",
    );
  }

  return {
    url: input.NEXT_PUBLIC_SUPABASE_URL,
    key:
      input.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      input.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

export const env = validateEnvironment({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  LEAD_RATE_LIMIT_SALT: process.env.LEAD_RATE_LIMIT_SALT,
});

export function getSupabaseEnvironment() {
  return requireSupabaseEnvironment(env);
}

export function getLeadRateLimitSalt() {
  if (!env.LEAD_RATE_LIMIT_SALT) {
    throw new Error("Serverska tajna za zaštitu upita nije podešena.");
  }

  return env.LEAD_RATE_LIMIT_SALT;
}

export function getSiteUrl() {
  return (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
