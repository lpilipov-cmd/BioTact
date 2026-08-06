import { z } from "zod";

export const packageCategories = [
  "imunitet",
  "digestija",
  "forma",
  "pokret",
  "lepota",
  "srce",
] as const;

export const packageCategorySchema = z.enum(packageCategories);

export const packageCategoryLabels = {
  imunitet: "Imunitet",
  digestija: "Digestija",
  forma: "Forma",
  pokret: "Pokret",
  lepota: "Lepota",
  srce: "Srce",
} satisfies Record<(typeof packageCategories)[number], string>;

export function parsePackageCategory(value?: string | string[]) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return packageCategorySchema.safeParse(candidate).data;
}

export function formatPackagePrice(priceRsd: number | null) {
  return priceRsd === null
    ? "Cena na upit"
    : new Intl.NumberFormat("sr-Latn-RS", {
        style: "currency",
        currency: "RSD",
        maximumFractionDigits: 0,
      }).format(priceRsd);
}
