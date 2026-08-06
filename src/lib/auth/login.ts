import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Unesite email adresu.")
    .email("Unesite ispravnu email adresu.")
    .max(254, "Email adresa je predugačka."),
  password: z
    .string()
    .min(1, "Unesite lozinku.")
    .max(1024, "Lozinka je predugačka."),
});

export type LoginInput = z.infer<typeof loginSchema>;

type LoginValidationResult =
  | { success: true; data: LoginInput }
  | { success: false; message: string };

export function validateLoginInput(input: unknown): LoginValidationResult {
  const result = loginSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message:
        result.error.issues[0]?.message ??
        "Proverite unete podatke.",
    };
  }

  return { success: true, data: result.data };
}
