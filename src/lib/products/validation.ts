import { z } from "zod";

import { findMedicalClaims, normalizePackageSlug } from "@/lib/packages/validation";

export const productCategories = ["zdravlje", "kozmetika", "mirisi"] as const;
export const productCategoryLabels = { zdravlje: "Zdravlje", kozmetika: "Kozmetika", mirisi: "Mirisi" } as const;

const optionalText = (maximum: number) => z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().trim().min(1).max(maximum).nullable(),
);
const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.url("Unesite ispravan URL.").max(2000).nullable(),
);
const decimal = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, "Koristite nenegativan decimalni broj sa najviše dve decimale.").nullable(),
);

export const productFormSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().transform(normalizePackageSlug).pipe(z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  articleNumber: z.string().trim().min(1).max(40).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),
  catalogueSourceCode: optionalText(80),
  category: z.enum(productCategories),
  subcategory: optionalText(100),
  shortDescription: optionalText(2000),
  packageContent: optionalText(120),
  cataloguePriceEur: decimal,
  partnerPriceEur: decimal,
  points: decimal,
  priceValidFrom: z.preprocess((value) => value === "" ? null : value, z.iso.date().nullable()),
  imagePath: z.preprocess((value) => value === "" ? null : value, z.string().trim().max(500).regex(/^\/products\//).nullable()),
  imageSourceUrl: optionalUrl,
  productSourceUrl: optionalUrl,
  active: z.boolean(),
  sortOrder: z.preprocess(Number, z.number().int().min(0)),
}).superRefine((value, context) => {
  const claims = findMedicalClaims(value.shortDescription ?? "");
  if (claims.length) context.addIssue({ code: "custom", path: ["shortDescription"], message: `Opis sadrži nedozvoljenu medicinsku tvrdnju: ${claims.join(", ")}.` });
});

export function productFormInput(formData: FormData) {
  return {
    name: formData.get("name"), slug: formData.get("slug"), articleNumber: formData.get("articleNumber"),
    catalogueSourceCode: formData.get("catalogueSourceCode"), category: formData.get("category"), subcategory: formData.get("subcategory"),
    shortDescription: formData.get("shortDescription"), packageContent: formData.get("packageContent"), cataloguePriceEur: formData.get("cataloguePriceEur"),
    partnerPriceEur: formData.get("partnerPriceEur"), points: formData.get("points"), priceValidFrom: formData.get("priceValidFrom"),
    imagePath: formData.get("imagePath"), imageSourceUrl: formData.get("imageSourceUrl"), productSourceUrl: formData.get("productSourceUrl"),
    active: formData.get("active") === "on", sortOrder: formData.get("sortOrder"),
  };
}

export function productMatchesSearch(name: string, articleNumber: string, search: string) {
  const term = search.trim().toLocaleLowerCase("sr-Latn");
  return !term || name.toLocaleLowerCase("sr-Latn").includes(term) || articleNumber.toLocaleLowerCase("sr-Latn").includes(term);
}
