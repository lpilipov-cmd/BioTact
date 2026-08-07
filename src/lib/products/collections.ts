export type ProductCollectionId =
  | "aloe-vera"
  | "digestija-i-ravnoteza"
  | "imunitet"
  | "energija-i-fokus"
  | "srce-i-cirkulacija"
  | "pokret-i-aktivan-zivot"
  | "lepota-i-posebne-rutine"
  | "body-mission";

export type ProductCollection = Readonly<{
  id: ProductCollectionId;
  label: string;
  description: string;
  articleNumbers: readonly string[];
  searchTerms: readonly string[];
}>;

export const productCollections = [
  {
    id: "aloe-vera",
    label: "Aloe Vera",
    description: "LR LIFETAKT Aloe Vera gelovi za piće i provereni setovi.",
    articleNumbers: [
      "80700", "80743", "81000", "81003", "80750", "80783", "80850",
      "80883", "80800", "80823", "81100", "81103", "95213", "96034",
    ],
    searchTerms: ["aloe vera"],
  },
  {
    id: "digestija-i-ravnoteza",
    label: "Digestija i ravnoteža",
    description: "Proizvodi za promišljenu svakodnevnu rutinu ishrane.",
    articleNumbers: ["80102", "81180", "81330", "80630", "80205"],
    searchTerms: ["digestija", "digestivna podrška", "unutrašnja ravnoteža"],
  },
  {
    id: "imunitet",
    label: "Imunitet",
    description: "Kolostrum, Cistus Incanus i odabrani dodaci ishrani.",
    articleNumbers: ["80360", "80361", "80325"],
    searchTerms: ["imunitet", "kolostrum"],
  },
  {
    id: "energija-i-fokus",
    label: "Energija i fokus",
    description: "Mind Master i Vita Active proizvodi za aktivnu svakodnevicu.",
    articleNumbers: ["80900", "80935", "80980", "80301", "80950", "80940", "80945"],
    searchTerms: ["energija", "fokus", "mind master", "vita active"],
  },
  {
    id: "srce-i-cirkulacija",
    label: "Srce i cirkulacija",
    description: "Super Omega i Reishi Plus iz LR LIFETAKT ponude.",
    articleNumbers: ["80338", "80331"],
    searchTerms: ["srce", "cirkulacija", "omega", "reishi"],
  },
  {
    id: "pokret-i-aktivan-zivot",
    label: "Pokret i aktivan život",
    description: "Active Freedom i Protein Power za aktivan stil života.",
    articleNumbers: ["80190", "80550"],
    searchTerms: ["pokret", "aktivan život", "active freedom", "protein"],
  },
  {
    id: "lepota-i-posebne-rutine",
    label: "Lepota i posebne rutine",
    description: "Odabrane formule za beauty i ciljane wellness rutine.",
    articleNumbers: ["80332", "81140", "81170"],
    searchTerms: ["lepota", "beauty", "wellness podrška"],
  },
  {
    id: "body-mission",
    label: "Body Mission / FiguActive",
    description: "LR FIGUACTIVE šejkovi, supe, ovsene opcije i užine.",
    articleNumbers: [
      "81251", "81245", "81246", "81244", "81255", "81247", "81249",
      "81248", "81260", "81241", "81250", "81242", "81240", "81243",
    ],
    searchTerms: ["body mission", "figuactive", "figu active"],
  },
] as const satisfies readonly ProductCollection[];

export const fallbackProductCollection = {
  id: "ostalo",
  label: "Ostali proizvodi",
  description: "Ostali provereni proizvodi u BIOTACT ponudi.",
  articleNumbers: [],
  searchTerms: ["ostalo"],
} as const;

const collectionByArticleNumber = new Map<string, ProductCollection>(
  productCollections.flatMap((collection) =>
    collection.articleNumbers.map((articleNumber) => [articleNumber, collection] as const),
  ),
);

const legacyCollectionQueries: Readonly<Record<string, ProductCollectionId>> = {
  "aloe vera": "aloe-vera",
  "digestivna podrška": "digestija-i-ravnoteza",
  "imunitet i kolostrum": "imunitet",
  "mind master": "energija-i-fokus",
  "srce i cirkulacija": "srce-i-cirkulacija",
  "pokret i snaga": "pokret-i-aktivan-zivot",
  "wellness podrška": "lepota-i-posebne-rutine",
  "lr figuactive i body mission": "body-mission",
};

export function getProductCollection(articleNumber: string) {
  return collectionByArticleNumber.get(articleNumber) ?? fallbackProductCollection;
}

export function parseProductCollectionQuery(value: string): ProductCollectionId | "" {
  const normalized = value.trim().toLocaleLowerCase("sr-Latn");
  if (!normalized) return "";

  const direct = productCollections.find(
    (collection) => collection.id === normalized || collection.label.toLocaleLowerCase("sr-Latn") === normalized,
  );

  return direct?.id ?? legacyCollectionQueries[normalized] ?? "";
}
