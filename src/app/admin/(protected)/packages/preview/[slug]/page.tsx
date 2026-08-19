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
  const { data: products } = await supabase.from("products").select("slug,article_number").in("article_number", packageData.products.map((item) => item.articleNumber));
  const linkedProductSlugs = new Set((products ?? []).map((item) => item.slug));

  return <PackageDetail packageData={{ ...packageData, priceRsd: packageData.priceRsd }} linkedProductSlugs={linkedProductSlugs} productDetailBasePath="/admin/products/preview" preview />;
}
