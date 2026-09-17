import type { packageCategories } from "@/lib/packages/constants";

export type PackageProductPresentation = Readonly<{
  articleNumber: string;
  catalogueSourceCode: string;
  name: string;
  slug: string;
  packageContent: string;
  imagePath: string;
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
    description: "Namenjen osobama koje žele podršku svakodnevnoj wellness rutini. Paket objedinjuje LR LIFETAKT Tečni Colostrum i Cistus Incanus Capsule iz kataloga.",
    focus: "Dve dopunske formule za jednostavnu svakodnevnu rutinu.",
    rationale: "Kombinacija je organizovana kao sažet početni izbor dva različita formata proizvoda za osobe koje žele jednostavniju wellness rutinu.",
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
    description: "Namenjen osobama koje žele jednostavnu podršku svakodnevnoj wellness rutini i ishrani. Paket objedinjuje PRO 12+ i LR LIFETAKT Herbal Fasting Tea.",
    focus: "Kapsule i biljna čajna mešavina u jednoj jasnoj selekciji.",
    rationale: "Paket povezuje dva različita formata proizvoda kako bi izbor za svakodnevnu rutinu i ishranu bio pregledniji.",
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
    description: "Namenjen osobama koje žele podršku aktivnom načinu života. Paket objedinjuje Aloe Vera Drinking Gel Active Freedom i LR LIFETAKT Active Freedom Capsule.",
    focus: "Dva Active Freedom formata za aktivnu svakodnevicu.",
    rationale: "Dva proizvoda iz iste Active Freedom linije predstavljena su zajedno kako bi izbor između tečnog i kapsuliranog formata bio jednostavan i jasan.",
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
    description: "Namenjen osobama koje žele podršku svakodnevnoj wellness rutini usmerenoj na srce i cirkulaciju. Paket objedinjuje Aloe Vera Drinking Gel Intense Sivera, Super Omega Capsule i LR LIFETAKT Reishi Plus Capsules.",
    focus: "Tri pažljivo grupisana proizvoda za svakodnevnu wellness rutinu.",
    rationale: "Tri različita formata objedinjena su u jednu preglednu selekciju za osobe koje žele organizovaniji svakodnevni wellness izbor.",
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
