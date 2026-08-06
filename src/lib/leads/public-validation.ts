import { z } from "zod";

import { normalizePhoneNumber } from "./contact";

const plausibleEmail = z.email();

export const publicLeadSchema = z.object({
  name: z.string().trim().min(1, "Unesite ime i prezime.").max(100, "Ime je predugačko."),
  contact: z
    .string()
    .trim()
    .min(3, "Unesite telefon ili email.")
    .max(254, "Kontakt je predugačak.")
    .refine(
      (value) => plausibleEmail.safeParse(value).success || normalizePhoneNumber(value) !== null,
      "Unesite ispravan telefon ili email.",
    ),
  packageInterestId: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().uuid("Izabrani paket nije ispravan.").optional(),
  ),
  productInterestId: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().uuid("Izabrani proizvod nije ispravan.").optional(),
  ),
  message: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(2000, "Poruka može imati najviše 2.000 znakova.").optional(),
  ),
  consent: z.boolean().refine((value) => value, "Saglasnost je obavezna."),
  website: z.string().max(0),
  formStartedAt: z.number().int().positive(),
  formToken: z.string().min(64).max(64),
  idempotencyKey: z.string().uuid(),
}).superRefine((value, context) => {
  if (value.packageInterestId && value.productInterestId) {
    context.addIssue({ code: "custom", path: ["productInterestId"], message: "Izaberite paket ili proizvod, ne oba." });
  }
});

export type PublicLeadInput = z.input<typeof publicLeadSchema>;
export type ValidPublicLead = z.output<typeof publicLeadSchema>;
