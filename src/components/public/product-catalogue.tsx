"use client";

import { useMemo, useState } from "react";

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

export function ProductCatalogue({
  products,
  detailBasePath = "/proizvodi",
  preview = false,
  initialSubcategory = "",
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [sort, setSort] = useState<(typeof sortOptions)[number][0]>("recommended");
  const categories = useMemo(() => [...new Set(products.map((item) => item.category))].sort(), [products]);
  const subcategories = useMemo(
    () => [...new Set(products.filter((item) => !category || item.category === category).map((item) => item.subcategory).filter(Boolean) as string[])].sort(),
    [category, products],
  );
  const visible = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("sr-Latn");
    const filtered = products.filter((item) =>
      (!term || `${item.name} ${item.short_description ?? ""} ${item.subcategory ?? ""}`.toLocaleLowerCase("sr-Latn").includes(term)) &&
      (!category || item.category === category) &&
      (!subcategory || item.subcategory === subcategory),
    );
    if (sort === "name-asc") return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "sr-Latn"));
    if (sort === "price-asc") return [...filtered].sort((a, b) => (a.catalogue_price_eur ?? Infinity) - (b.catalogue_price_eur ?? Infinity));
    if (sort === "price-desc") return [...filtered].sort((a, b) => (b.catalogue_price_eur ?? -Infinity) - (a.catalogue_price_eur ?? -Infinity));
    return filtered;
  }, [category, products, search, sort, subcategory]);

  return (
    <>
      <section className="catalogue-toolbar" aria-label="Pretraga i filteri proizvoda">
        <label className="catalogue-search">
          <span>Pretražite proizvode</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Naziv ili namena" />
        </label>
        <label>
          <span>Kategorija</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory(""); }}>
            <option value="">Sve kategorije</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Potkategorija</span>
          <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
            <option value="">Sve potkategorije</option>
            {subcategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Redosled</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#5b6960]">
        <p aria-live="polite">Prikazano: <strong className="text-[#17301f]">{visible.length}</strong> proizvoda</p>
        {preview ? <p className="rounded-full bg-[#17301f] px-3 py-1 font-bold text-[#f7f3ea]">Zaštićeni pregled · neaktivni proizvodi</p> : null}
      </div>

      {visible.length ? (
        <div className="product-grid" data-testid="product-grid">
          {visible.map((product) => <ProductCard key={product.slug} product={product} detailBasePath={detailBasePath} />)}
        </div>
      ) : (
        <section className="empty-state" data-testid="empty-product-catalogue">
          <h2 className="text-xl font-bold">Nema proizvoda za izabrane filtere.</h2>
          <p className="mt-2 text-sm text-[#5b6960]">Promenite pretragu ili filtere da biste videli druge proizvode.</p>
          <button className="button-secondary mt-5" type="button" onClick={() => { setSearch(""); setCategory(""); setSubcategory(""); setSort("recommended"); }}>Poništi filtere</button>
        </section>
      )}
    </>
  );
}
