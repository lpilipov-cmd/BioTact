import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Unesite email adresu.")
    .email("Unesite ispravnu email adresu.")
    .max(254, "Email adresa je predugačka."),
});

const passwordSchema = z
  .string()
  .min(12, "Lozinka mora imati najmanje 12 znakova.")
  .max(72, "Lozinka može imati najviše 72 znaka.")
  .regex(/[A-Za-zČĆŽŠĐčćžšđ]/, "Lozinka mora sadržati slovo.")
  .regex(/\d/, "Lozinka mora sadržati broj.");

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Lozinke se ne podudaraju.",
    path: ["confirmPassword"],
  });

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

function firstIssueMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Proverite unete podatke.";
}

export function validateRecoveryEmail(
  input: unknown,
): ValidationResult<z.infer<typeof emailSchema>> {
  const result = emailSchema.safeParse(input);

  return result.success
    ? { success: true, data: result.data }
    : { success: false, message: firstIssueMessage(result.error) };
}

export function validateNewPassword(
  input: unknown,
): ValidationResult<z.infer<typeof resetPasswordSchema>> {
  const result = resetPasswordSchema.safeParse(input);

  return result.success
    ? { success: true, data: result.data }
    : { success: false, message: firstIssueMessage(result.error) };
}

export function getRecoveryCallbackUrl(siteUrl: string) {
  return `${siteUrl.replace(/\/$/, "")}/admin/auth/callback`;
}
