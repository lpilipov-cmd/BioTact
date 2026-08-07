"use client";

import { useMemo, useState } from "react";

import {
  fallbackProductCollection,
  getProductCollection,
  parseProductCollectionQuery,
  productCollections,
  type ProductCollectionId,
} from "@/lib/products/collections";

import { ProductCard } from "./product-card";

export type CatalogueProduct = Readonly<{
  article_number: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string | null;
  short_description: string | null;
  package_content: string | null;
  catalogue_price_eur: number | null;
  image_path: string | null;
}>;

type Props = Readonly<{
  products: readonly CatalogueProduct[];
  detailBasePath?: string;
  preview?: boolean;
  initialSubcategory?: string;
}>;

const sortOptions = [
  ["recommended", "Preporučeno"],
  ["name-asc", "Naziv A–Ž"],
  ["price-asc", "Cena: niža prvo"],
  ["price-desc", "Cena: viša prvo"],
] as const;

type SortOption = (typeof sortOptions)[number][0];
type CollectionFilter = ProductCollectionId | "ostalo" | "";

function sortProducts(products: readonly CatalogueProduct[], sort: SortOption) {
  if (sort === "name-asc") return [...products].sort((a, b) => a.name.localeCompare(b.name, "sr-Latn"));
  if (sort === "price-asc") return [...products].sort((a, b) => (a.catalogue_price_eur ?? Infinity) - (b.catalogue_price_eur ?? Infinity));
  if (sort === "price-desc") return [...products].sort((a, b) => (b.catalogue_price_eur ?? -Infinity) - (a.catalogue_price_eur ?? -Infinity));
  return [...products];
}

function normalizedSearchValue(value: string) {
  return value.trim().toLocaleLowerCase("sr-Latn");
}

export function ProductCatalogue({
  products,
  detailBasePath = "/proizvodi",
  preview = false,
  initialSubcategory = "",
}: Props) {
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState<CollectionFilter>(() => parseProductCollectionQuery(initialSubcategory));
  const [sort, setSort] = useState<SortOption>("recommended");

  const availableCollections = useMemo(() => {
    const articleNumbers = new Set(products.map((product) => product.article_number));
    const supported = productCollections.filter((item) => item.articleNumbers.some((articleNumber) => articleNumbers.has(articleNumber)));
    const hasFallbackProducts = products.some((product) => getProductCollection(product.article_number) === fallbackProductCollection);
    return hasFallbackProducts ? [...supported, fallbackProductCollection] : supported;
  }, [products]);

  const visible = useMemo(() => {
    const term = normalizedSearchValue(search);
    const filtered = products.filter((product) => {
      const productCollection = getProductCollection(product.article_number);
      const searchableText = [
        product.name,
        product.short_description,
        product.subcategory,
        product.package_content,
        productCollection.label,
        ...productCollection.searchTerms,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("sr-Latn");

      return (!term || searchableText.includes(term)) && (!collection || productCollection.id === collection);
    });

    return sortProducts(filtered, sort);
  }, [collection, products, search, sort]);

  const groupedProducts = useMemo(
    () => availableCollections
      .map((item) => ({ collection: item, products: visible.filter((product) => getProductCollection(product.article_number).id === item.id) }))
      .filter((group) => group.products.length),
    [availableCollections, visible],
  );

  const hasActiveDiscovery = Boolean(normalizedSearchValue(search) || collection);
  const selectedCollection = availableCollections.find((item) => item.id === collection);

  function resetDiscovery() {
    setSearch("");
    setCollection("");
    setSort("recommended");
  }

  return (
    <section className="catalogue-discovery" aria-label="Katalog proizvoda">
      <div className="catalogue-toolbar">
        <label className="catalogue-search">
          <span>Pretražite proizvode</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Naziv, kolekcija ili proizvod"
          />
        </label>
        <label className="catalogue-sort">
          <span>Redosled</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      <nav className="catalogue-collection-nav" aria-label="Kolekcije proizvoda" data-testid="catalogue-collection-nav">
        <button type="button" aria-pressed={!collection} onClick={() => setCollection("")}>Svi proizvodi</button>
        {availableCollections.map((item) => (
          <button
            type="button"
            aria-pressed={collection === item.id}
            onClick={() => setCollection(item.id as CollectionFilter)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="catalogue-result-summary">
        <p aria-live="polite">Prikazano: <strong>{visible.length}</strong> proizvoda</p>
        {preview ? <p className="catalogue-preview-pill">Zaštićeni pregled · neaktivni proizvodi</p> : null}
      </div>

      {visible.length ? hasActiveDiscovery ? (
        <section className="catalogue-filtered-results" aria-labelledby="catalogue-results-heading">
          <header className="catalogue-results-heading">
            <div>
              <p className="eyebrow">Rezultati izbora</p>
              <h2 id="catalogue-results-heading">{selectedCollection?.label ?? "Pronađeni proizvodi"}</h2>
            </div>
            {selectedCollection ? <p>{selectedCollection.description}</p> : null}
          </header>
          <div className="product-grid" data-testid="product-grid">
            {visible.map((product, index) => <ProductCard key={product.slug} product={product} detailBasePath={detailBasePath} priority={index < 2} />)}
          </div>
        </section>
      ) : (
        <div className="catalogue-collections" data-testid="product-grid">
          {groupedProducts.map((group, groupIndex) => (
            <section className="catalogue-collection" data-collection={group.collection.id} aria-labelledby={`collection-${group.collection.id}`} key={group.collection.id}>
              <header className="catalogue-collection-heading">
                <div>
                  <p>{String(groupIndex + 1).padStart(2, "0")} · kolekcija</p>
                  <h2 id={`collection-${group.collection.id}`}>{group.collection.label}</h2>
                </div>
                <p>{group.collection.description}</p>
              </header>
              <div className="product-grid">
                {group.products.map((product, index) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    detailBasePath={detailBasePath}
                    priority={groupIndex === 0 && index < 2}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="catalogue-zero-state" data-testid="empty-product-catalogue">
          <p className="eyebrow">Nema rezultata</p>
          <h2>Nismo pronašli proizvod za ovaj izbor.</h2>
          <p>Probajte kraći naziv ili izaberite drugu kolekciju.</p>
          <button className="button-secondary" type="button" onClick={resetDiscovery}>Prikaži sve proizvode</button>
        </section>
      )}
    </section>
  );
}
