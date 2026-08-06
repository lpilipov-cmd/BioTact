import type { Metadata } from "next";

import { ContactForm } from "./contact-form";
import { env, getLeadRateLimitSalt } from "@/lib/env";
import { createLeadFormProof } from "@/lib/leads/protection";
import { createLeadSuccessWhatsAppLink } from "@/lib/leads/whatsapp";
import { resolveContactInterest } from "@/lib/products/contact-selection";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Pošaljite upit BIOTACT timu.",
  alternates: { canonical: "/kontakt" },
  openGraph: { title: "Kontakt | BIOTACT", description: "Pošaljite upit BIOTACT timu.", url: "/kontakt" },
};

type ContactPageProps = Readonly<{ searchParams: Promise<{ package?: string | string[]; product?: string | string[] }> }>;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const supabase = await createClient();
  const [{ data: packages, error: packageError }, { data: products, error: productError }] = await Promise.all([
    supabase.from("packages").select("id,slug,name").eq("active", true).order("sort_order").order("name"),
    supabase.from("products").select("id,slug,name,article_number").eq("active", true).order("sort_order").order("name"),
  ]);
  const requested = await searchParams;
  const packageSlug = requested.package;
  const requestedSlug = typeof packageSlug === "string" ? packageSlug : undefined;
  const productSlug = typeof requested.product === "string" ? requested.product : undefined;
  const { packageInterestId: initialPackageId, productInterestId: initialProductId } = resolveContactInterest(
    packages ?? [],
    products ?? [],
    requestedSlug,
    productSlug,
  );
  const proof = createLeadFormProof(getLeadRateLimitSalt());

  return (
    <main id="glavni-sadrzaj" className="min-h-screen px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Lični kontakt</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Pošaljite upit</h1>
        <p className="mt-4 leading-7 text-[#374c3d]">Ostavite kontakt i javićemo Vam se sa informacijama o BIOTACT paketima i načinu poručivanja.</p>

        {packageError || productError ? (
          <p role="alert" className="mt-8 rounded-xl border border-red-900/20 bg-red-50 p-4">Opcije trenutno nije moguće učitati. Upit i dalje možete poslati bez izbora.</p>
        ) : null}

        <div className="mt-8">
          <ContactForm
            packages={packages ?? []}
            products={products ?? []}
            initialPackageId={initialPackageId}
            initialProductId={initialProductId}
            formStartedAt={proof.formStartedAt}
            formToken={proof.formToken}
            whatsappLink={createLeadSuccessWhatsAppLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
          />
        </div>
      </div>
    </main>
  );
}
