import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PackageDetail } from "@/components/public/package-detail";
import { requireAdministrator } from "@/lib/auth/admin";
import { getApprovedPackagePresentation } from "@/lib/packages/presentation";

type PackagePreviewDetailProps = Readonly<{ params: Promise<{ slug: string }> }>;

export const metadata: Metadata = { title: "Pregled BIOTACT paketa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PackagePreviewDetailPage({ params }: PackagePreviewDetailProps) {
  const { slug } = await params;
  const packageData = getApprovedPackagePresentation(slug);
  if (!packageData) notFound();

  const { supabase } = await requireAdministrator();
  const { data: products } = await supabase.from("products").select("slug,article_number,name,package_content,catalogue_price_eur,image_path").in("article_number", packageData.products.map((item) => item.articleNumber));
  const linkedProductSlugs = new Set((products ?? []).map((item) => item.slug));
  const productsByArticle = new Map((products ?? []).map((product) => [product.article_number, product]));
  const presentedProducts = packageData.products.map((product) => {
    const current = productsByArticle.get(product.articleNumber);
    return current ? {
      ...product,
      slug: current.slug,
      name: current.name,
      packageContent: current.package_content ?? product.packageContent,
      imagePath: current.image_path ?? product.imagePath,
      cataloguePriceEur: current.catalogue_price_eur,
    } : product;
  });

  return <PackageDetail packageData={{ ...packageData, products: presentedProducts, priceRsd: packageData.priceRsd }} linkedProductSlugs={linkedProductSlugs} productDetailBasePath="/admin/products/preview" preview />;
}
