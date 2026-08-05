import { z } from "zod";

const optionalValue = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const environmentSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: optionalValue(z.url()),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalValue(z.string().min(20)),
  })
  .refine(
    ({ NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY }) =>
      Boolean(NEXT_PUBLIC_SUPABASE_URL) ===
      Boolean(NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      message:
        "Supabase URL i anonimni ključ moraju biti podešeni zajedno.",
      path: ["NEXT_PUBLIC_SUPABASE_URL"],
    },
  );

export function validateEnvironment(
  input: Record<string, string | undefined>,
) {
  return environmentSchema.parse(input);
}

export const env = validateEnvironment({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
