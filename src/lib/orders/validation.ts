import { z } from "zod";

import { normalizePhoneNumber } from "@/lib/leads/contact";

const plausibleEmail = z.email();

export const cartOrderSchema = z.object({
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
  message: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(2000, "Napomena može imati najviše 2.000 znakova.").optional(),
  ),
  consent: z.boolean().refine((value) => value, "Saglasnost je obavezna."),
  website: z.string().max(0),
  formStartedAt: z.number().int().positive(),
  formToken: z.string().length(64),
  idempotencyKey: z.string().uuid(),
  items: z
    .array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(99),
    }).strict())
    .min(1, "Korpa je prazna.")
    .max(20, "Porudžbina može sadržati najviše 20 različitih proizvoda.")
    .refine(
      (items) => new Set(items.map((item) => item.productId)).size === items.length,
      "Proizvodi u korpi moraju biti jedinstveni.",
    ),
}).strict();

export type CartOrderInput = z.input<typeof cartOrderSchema>;
export type ValidCartOrder = z.output<typeof cartOrderSchema>;
