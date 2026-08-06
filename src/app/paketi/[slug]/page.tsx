import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { env } from "@/lib/env";
import { formatPackagePrice, packageCategories, packageCategoryLabels } from "@/lib/packages/constants";
import { getActivePackageBySlug } from "@/lib/packages/public";
import { createPackageWhatsAppLink } from "@/lib/packages/whatsapp";

type PackageDetailPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!validSlug.test(slug)) return { title: "Paket nije pronađen | BIOTACT" };

  const { data } = await getActivePackageBySlug(slug);
  if (!data) return { title: "Paket nije pronađen | BIOTACT" };

  const description = data.description.replace(/\s+/g, " ").slice(0, 155);
  return {
    title: `${data.name} | BIOTACT`,
    description,
    openGraph: { title: `${data.name} | BIOTACT`, description },
  };
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  if (!validSlug.test(slug)) notFound();

  const { data: packageData, error } = await getActivePackageBySlug(slug);
  if (!packageData && !error) notFound();
  if (error || !packageData) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <section role="alert" className="mx-auto max-w-3xl rounded-2xl border border-red-900/20 bg-red-50 p-6">
          <h1 className="text-xl font-bold">Paket trenutno nije dostupan.</h1>
          <Link href="/paketi" className="mt-5 inline-block font-semibold underline">Nazad na pakete</Link>
        </section>
      </main>
    );
  }

  const category = packageCategories.includes(packageData.category as (typeof packageCategories)[number])
    ? packageCategoryLabels[packageData.category as (typeof packageCategories)[number]]
    : "Wellness";
  const whatsappLink = createPackageWhatsAppLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER, packageData.name);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl">
        <Link href="/paketi" className="text-sm font-semibold underline underline-offset-4">← Nazad na pakete</Link>
        <div className="mt-6 rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5b6960]">{category}</p>
          <h1 className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">{packageData.name}</h1>
          <p className="mt-6 whitespace-pre-wrap break-words leading-8 text-[#374c3d]">{packageData.description}</p>

          <section className="mt-8 border-t border-[#17301f]/15 pt-6">
            <h2 className="text-xl font-bold">Šifre proizvoda</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {packageData.product_codes.map((code) => (
                <li key={code} className="max-w-full break-all rounded-lg bg-[#17301f]/8 px-3 py-2 font-mono text-sm">{code}</li>
              ))}
            </ul>
          </section>

          <p className="mt-8 text-2xl font-bold">{formatPackagePrice(packageData.price_rsd)}</p>
          <Link
            href={`/kontakt?package=${encodeURIComponent(packageData.slug)}`}
            className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#17301f] px-6 font-bold text-[#f7f3ea]"
          >
            Pošalji upit
          </Link>
          {whatsappLink ? (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-5 ml-0 inline-flex min-h-12 items-center rounded-xl border border-[#17301f] px-6 font-bold sm:ml-3">
              Pitaj putem WhatsApp-a
            </a>
          ) : (
            <p className="mt-5 rounded-xl border border-[#17301f]/15 bg-[#f7f3ea] p-4 text-sm text-[#5b6960]">
              WhatsApp kontakt biće prikazan kada vlasnik potvrdi javni broj.
            </p>
          )}

          <aside className="mt-8 rounded-xl border border-[#17301f]/15 bg-[#f7f3ea] p-4 text-sm leading-6 text-[#5b6960]">
            <strong className="text-[#17301f]">Važna napomena:</strong> Dodaci ishrani nisu zamena za raznovrsnu ishranu i zdrav način života. Za individualni savet obratite se kvalifikovanom zdravstvenom stručnjaku.
          </aside>
        </div>
      </article>
    </main>
  );
}
