export type ProductType = "individual" | "multipack" | "set";

export type ProductPresentation = Readonly<{
  type: ProductType;
  badge: string | null;
  quantity: string | null;
  constituentImagePaths: readonly string[];
  constituentNotice: string | null;
  imageScale?: "medium" | "small";
}>;

const multipackPresentations: Readonly<Record<string, ProductPresentation>> = {
  "80743": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/80700/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
  "81003": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/81000/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
  "80783": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/80750/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
  "80883": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/80850/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
  "80823": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/80800/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
  "81103": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "3 × 1.000 ml",
    constituentImagePaths: ["/products/81100/product.webp"],
    constituentNotice: "Ponuda sadrži tri jedinice prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
    imageScale: "medium",
  },
  "80935": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "5 × 500 ml — izbor Formula Green / Formula Red",
    constituentImagePaths: ["/products/80900/product.webp", "/products/80950/product.webp"],
    constituentNotice: "Ponuda sadrži pet jedinica po slobodnom izboru Formula Green / Formula Red; fotografije prikazuju dostupne varijante, ne fiksnu kombinaciju.",
  },
  "80945": {
    type: "multipack",
    badge: "MULTIPACK",
    quantity: "5 × 500 ml",
    constituentImagePaths: ["/products/80940/product.webp"],
    constituentNotice: "Ponuda sadrži pet jedinica prikazanog LR proizvoda; fotografija prikazuje pojedinačnu jedinicu.",
  },
};

const setArticleNumbers = new Set(["95213", "96034", "81260"]);
const constrainedImageScales = new Map<string, ProductPresentation["imageScale"]>([
  ["81100", "medium"],
  ["81248", "small"],
  ["81249", "small"],
]);

export function getProductPresentation(articleNumber: string): ProductPresentation {
  const multipack = multipackPresentations[articleNumber];
  if (multipack) return multipack;
  if (setArticleNumbers.has(articleNumber)) {
    return { type: "set", badge: "SET", quantity: null, constituentImagePaths: [], constituentNotice: null };
  }
  return {
    type: "individual",
    badge: null,
    quantity: null,
    constituentImagePaths: [],
    constituentNotice: null,
    imageScale: constrainedImageScales.get(articleNumber),
  };
}
