import { z } from "zod";

import { packageCategorySchema } from "./constants";

const medicalClaimPatterns = [
  {
    label: "leči / izleči",
    pattern:
      /(?:^|[^\p{L}])(?:iz)?le[čc](?:i|iti|enje|en|ena|eno|e|uje|uju|io|ila)?(?!\p{L})/iu,
  },
  {
    label: "sprečava bolest",
    pattern:
      /(?:^|[^\p{L}])spre[čc]ava\p{L}*\s+(?:bolest|oboljenj)\p{L}*/iu,
  },
  { label: "garantovano", pattern: /(?:^|[^\p{L}])garantovan\p{L}*/iu },
  { label: "dijagnoza", pattern: /(?:^|[^\p{L}])dijagnoz\p{L}*/iu },
  { label: "terapija", pattern: /(?:^|[^\p{L}])terapij\p{L}*/iu },
  {
    label: "zamena za lek",
    pattern: /(?:^|[^\p{L}])zamena\s+za\s+lek\p{L}*/iu,
  },
] as const;

export function findMedicalClaims(value: string) {
  return medicalClaimPatterns
    .filter(({ pattern }) => pattern.test(value))
    .map(({ label }) => label);
}

export function normalizePackageSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("sr-Latn")
    .replaceAll("đ", "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function parseProductCodes(value: string) {
  return [...new Set(value.split(/[\n,]+/).map((code) => code.trim()).filter(Boolean))];
}

const nullablePrice = z.preprocess(
  (value) => (value === "" || value === null ? null : Number(value)),
  z.number({ error: "Cena mora biti ceo broj." }).int("Cena mora biti ceo broj.").positive("Cena mora biti pozitivan broj.").nullable(),
);

const sortOrder = z.preprocess(
  (value) => Number(value),
  z.number({ error: "Redosled mora biti ceo broj." }).int("Redosled mora biti ceo broj.").min(0, "Redosled ne može biti negativan."),
);

export const packageFormSchema = z
  .object({
    name: z.string().trim().min(1, "Naziv je obavezan.").max(120, "Naziv može imati najviše 120 znakova."),
    slug: z.string().transform(normalizePackageSlug).pipe(
      z.string().min(1, "Slug je obavezan.").max(100, "Slug može imati najviše 100 znakova.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug nije ispravan."),
    ),
    category: packageCategorySchema,
    description: z.string().trim().min(1, "Opis je obavezan.").max(2000, "Opis može imati najviše 2000 znakova."),
    productCodes: z.string().transform(parseProductCodes).pipe(
      z.array(z.string().max(80, "Šifra može imati najviše 80 znakova.")).min(1, "Unesite najmanje jednu šifru proizvoda."),
    ),
    priceRsd: nullablePrice,
    active: z.boolean(),
    sortOrder,
  })
  .superRefine((data, context) => {
    const claims = findMedicalClaims(data.description);
    if (claims.length) {
      context.addIssue({
        code: "custom",
        path: ["description"],
        message: `Opis sadrži nedozvoljenu medicinsku tvrdnju: ${claims.join(", ")}. Koristite neutralan izraz poput „podržava”.`,
      });
    }
  });

export function packageFormInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
    productCodes: formData.get("productCodes"),
    priceRsd: formData.get("priceRsd"),
    active: formData.get("active") === "on",
    sortOrder: formData.get("sortOrder"),
  };
}
