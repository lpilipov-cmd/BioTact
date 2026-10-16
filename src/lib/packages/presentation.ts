import type { packageCategories } from "@/lib/packages/constants";

export type PackageProductPresentation = Readonly<{
  articleNumber: string;
  catalogueSourceCode: string;
  name: string;
  slug: string;
  packageContent: string;
  imagePath: string;
  shortDescription?: string | null;
  cataloguePriceEur?: number | null;
}>;

export type ApprovedPackagePresentation = Readonly<{
  slug: string;
  name: string;
  category: (typeof packageCategories)[number];
  description: string;
  focus: string;
  rationale: string;
  productCodes: readonly string[];
  products: readonly PackageProductPresentation[];
  priceRsd: null;
  sortOrder: number;
}>;

export const approvedPackagePresentations = [
  {
    slug: "imunitet-start",
    name: "Imunitet Start",
    category: "imunitet",
    description: "Dva LR proizvoda u različitim formatima, objedinjena kao pregledna selekcija za svakodnevnu wellness rutinu.",
    focus: "Tečni i kapsulirani format u jednoj preglednoj selekciji.",
    rationale: "Proizvodi su predstavljeni zajedno kako bi poređenje različitih formata i organizacija svakodnevne rutine bili jednostavniji.",
    productCodes: ["80361-50", "80325-50"],
    products: [
      { articleNumber: "80361", catalogueSourceCode: "80361-50", name: "Colostrum Liquid", slug: "colostrum-liquid-80361", packageContent: "125 ml", imagePath: "/products/80361/product.webp" },
      { articleNumber: "80325", catalogueSourceCode: "80325-50", name: "Cistus Incanus kapsule", slug: "cistus-incanus-kapsule-80325", packageContent: "60 kapsula", imagePath: "/products/80325/product.webp" },
    ],
    priceRsd: null,
    sortOrder: 1,
  },
  {
    slug: "creva-energija",
    name: "Creva & Energija",
    category: "digestija",
    description: "Kapsule i biljna čajna mešavina, grupisane za lakše poređenje i organizaciju svakodnevne wellness rutine.",
    focus: "Kapsule i biljna čajna mešavina u jednoj jasnoj selekciji.",
    rationale: "Dva različita formata prikazana su zajedno kako bi njihov sadržaj, pakovanje i pojedinačne informacije bili lakši za pregled.",
    productCodes: ["81180-99", "80205-650"],
    products: [
      { articleNumber: "81180", catalogueSourceCode: "81180-99", name: "Pro 12+ kapsule", slug: "pro-12-kapsule-81180", packageContent: "30 kapsula", imagePath: "/products/81180/product.webp" },
      { articleNumber: "80205", catalogueSourceCode: "80205-650", name: "Herbal Fasting dijetalna čajna mešavina", slug: "herbal-fasting-dijetalna-cajna-mesavina-80205", packageContent: "250 g", imagePath: "/products/80205/product.webp" },
    ],
    priceRsd: null,
    sortOrder: 2,
  },
  {
    slug: "pokret-snaga",
    name: "Pokret & Snaga",
    category: "pokret",
    description: "Dva proizvoda iz Active Freedom linije, predstavljena zajedno kao tečni i kapsulirani format.",
    focus: "Dva Active Freedom formata za aktivnu svakodnevicu.",
    rationale: "Proizvodi iz iste linije grupisani su radi jasnog poređenja tečnog i kapsuliranog formata, bez pretpostavki o tome koji izbor više odgovara korisniku.",
    productCodes: ["80850-680", "80190-50"],
    products: [
      { articleNumber: "80850", catalogueSourceCode: "80850-680", name: "Aloe vera Freedom napitak", slug: "aloe-vera-freedom-napitak-80850", packageContent: "1000 ml", imagePath: "/products/80850/product.webp" },
      { articleNumber: "80190", catalogueSourceCode: "80190-50", name: "Active Freedom kapsule", slug: "active-freedom-kapsule-80190", packageContent: "60 kapsula", imagePath: "/products/80190/product.webp" },
    ],
    priceRsd: null,
    sortOrder: 3,
  },
  {
    slug: "srce-cirkulacija",
    name: "Srce & Cirkulacija",
    category: "srce",
    description: "Tri LR proizvoda u različitim formatima, objedinjena u preglednu wellness selekciju.",
    focus: "Tri pažljivo grupisana proizvoda za svakodnevnu wellness rutinu.",
    rationale: "Tri različita formata prikazana su u jednoj selekciji kako bi poređenje proizvoda i organizacija ličnog izbora bili pregledniji.",
    productCodes: ["80800-50", "80338-699", "80331-50"],
    products: [
      { articleNumber: "80800", catalogueSourceCode: "80800-50", name: "Aloe vera Sivera napitak", slug: "aloe-vera-sivera-napitak-80800", packageContent: "1000 ml", imagePath: "/products/80800/product.webp" },
      { articleNumber: "80338", catalogueSourceCode: "80338-699", name: "Super Omega 3 kapsule", slug: "super-omega-3-kapsule-80338", packageContent: "60 kapsula", imagePath: "/products/80338/product.webp" },
      { articleNumber: "80331", catalogueSourceCode: "80331-50", name: "Reishi Plus kapsule", slug: "reishi-plus-kapsule-80331", packageContent: "30 kapsula", imagePath: "/products/80331/product.webp" },
    ],
    priceRsd: null,
    sortOrder: 4,
  },
] as const satisfies readonly ApprovedPackagePresentation[];

export const approvedPackageSlugs = approvedPackagePresentations.map((item) => item.slug);

export function getApprovedPackagePresentation(slug: string) {
  return approvedPackagePresentations.find((item) => item.slug === slug) ?? null;
}

export function hasCanonicalProductMapping(slug: string, productCodes: readonly string[]) {
  const presentation = getApprovedPackagePresentation(slug);
  return Boolean(
    presentation &&
      presentation.productCodes.length === productCodes.length &&
      presentation.productCodes.every((code, index) => code === productCodes[index]),
  );
}
