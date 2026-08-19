import type { Metadata } from "next";

import { PackageCard } from "@/components/public/package-card";
import { requireAdministrator } from "@/lib/auth/admin";
import { approvedPackagePresentations } from "@/lib/packages/presentation";

export const metadata: Metadata = { title: "Pregled BIOTACT paketa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PackagePreviewPage() {
  const { supabase } = await requireAdministrator();
  const articleNumbers = approvedPackagePresentations.flatMap((item) => item.products.map((product) => product.articleNumber));
  const { data: products } = await supabase.from("products").select("article_number").in("article_number", articleNumbers);
  const availableArticles = new Set((products ?? []).map((item) => item.article_number));

  return (
    <main id="glavni-sadrzaj" className="packages-page package-preview-page">
      <div className="package-preview-banner"><strong>Zaštićeni vlasnički pregled</strong><span>Četiri odobrena paketa · proizvodi ostaju neaktivni</span></div>
      <header className="packages-header">
        <div><p className="package-kicker package-kicker-light">Kurirane BIOTACT kolekcije</p><h1>Paketi koji izbor čine jednostavnijim.</h1></div>
        <p>Pregled koristi odobrene sastave i proverene lokalne slike. Ne menja status paketa ili proizvoda i nije javno indeksiran.</p>
      </header>
      <div className="packages-content">
        <p className="package-preview-integrity" role="status">Pronađeno {availableArticles.size} od {articleNumbers.length} proizvoda iz odobrenih sastava.</p>
        <div className="package-list-grid" data-testid="public-package-list">
          {approvedPackagePresentations.map((item, index) => <PackageCard key={item.slug} packageData={{ ...item, priceRsd: item.priceRsd }} detailBasePath="/admin/packages/preview" priority={index < 2} />)}
        </div>
      </div>
    </main>
  );
}
