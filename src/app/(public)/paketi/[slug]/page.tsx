import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageDetail } from "@/components/public/package-detail";
import { getActivePackageBySlug } from "@/lib/packages/public";
import { getApprovedPackagePresentation, hasCanonicalProductMapping } from "@/lib/packages/presentation";

type PackageDetailPageProps = Readonly<{ params: Promise<{ slug: string }> }>;
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const presentation = validSlug.test(slug) ? getApprovedPackagePresentation(slug) : null;
  if (!presentation) return { title: "Paket nije pronađen" };
  const { data } = await getActivePackageBySlug(slug);
  if (!data || !hasCanonicalProductMapping(slug, data.product_codes)) return { title: "Paket nije pronađen" };
  const description = data.description.replace(/\s+/g, " ").slice(0, 155);
  return { title: data.name, description, alternates: { canonical: `/paketi/${data.slug}` }, openGraph: { title: `${data.name} | BIOTACT`, description, url: `/paketi/${data.slug}` } };
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const presentation = validSlug.test(slug) ? getApprovedPackagePresentation(slug) : null;
  if (!presentation) notFound();

  const { data: packageData, error } = await getActivePackageBySlug(slug);
  if (!packageData && !error) notFound();
  if (error || !packageData || !hasCanonicalProductMapping(slug, packageData.product_codes)) {
    return <main id="glavni-sadrzaj" className="min-h-screen px-4 py-10 sm:px-6"><section role="alert" className="mx-auto max-w-3xl rounded-2xl border border-red-900/20 bg-red-50 p-6"><h1 className="text-xl font-bold">Paket trenutno nije dostupan.</h1><Link href="/paketi" className="mt-5 inline-block font-semibold underline">Nazad na pakete</Link></section></main>;
  }

  return <PackageDetail packageData={{ ...presentation, name: packageData.name, priceRsd: packageData.price_rsd }} description={packageData.description} />;
}
