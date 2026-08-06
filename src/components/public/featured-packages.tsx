import Link from "next/link";

import { formatPackagePrice, packageCategories, packageCategoryLabels } from "@/lib/packages/constants";
import type { Tables } from "@/lib/supabase/database.types";

type FeaturedPackage = Pick<Tables<"packages">, "slug" | "name" | "category" | "description" | "price_rsd">;

export function FeaturedPackages({ packages, unavailable = false }: Readonly<{ packages: readonly FeaturedPackage[]; unavailable?: boolean }>) {
  if (unavailable) {
    return <div role="status" className="empty-state"><h3 className="text-xl font-bold">Paketi trenutno nisu dostupni.</h3><p className="mt-2 text-[#5b6960]">Možete nam poslati upit i bez izbora paketa.</p><Link href="/kontakt" className="button-secondary mt-5">Kontaktirajte nas</Link></div>;
  }

  if (packages.length === 0) {
    return <div className="empty-state" data-testid="featured-package-empty"><h3 className="text-xl font-bold">Paketi će uskoro biti dostupni.</h3><p className="mt-2 text-[#5b6960]">Objavićemo samo proverene informacije. Do tada nam možete poslati opšti upit.</p><Link href="/kontakt" className="button-secondary mt-5">Pošalji upit</Link></div>;
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3" data-testid="featured-package-list">
      {packages.map((item) => {
        const category = packageCategories.includes(item.category as (typeof packageCategories)[number])
          ? packageCategoryLabels[item.category as (typeof packageCategories)[number]]
          : "Wellness";
        return (
          <article key={item.slug} data-testid="featured-package-card" className="premium-card">
            <p className="eyebrow">{category}</p>
            <h3 className="mt-3 text-2xl font-bold">{item.name}</h3>
            <p className="mt-4 line-clamp-3 flex-1 leading-7 text-[#476050]">{item.description}</p>
            <p className="mt-5 font-bold">{formatPackagePrice(item.price_rsd)}</p>
            <Link href={`/paketi/${item.slug}`} className="button-primary mt-5 w-full">Pogledaj paket</Link>
          </article>
        );
      })}
    </div>
  );
}
