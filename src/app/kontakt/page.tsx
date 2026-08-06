import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "./contact-form";
import { env, getLeadRateLimitSalt } from "@/lib/env";
import { createLeadFormProof } from "@/lib/leads/protection";
import { createLeadSuccessWhatsAppLink } from "@/lib/leads/whatsapp";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kontakt | BIOTACT",
  description: "Pošaljite upit BIOTACT timu.",
};

type ContactPageProps = Readonly<{ searchParams: Promise<{ package?: string | string[] }> }>;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const supabase = await createClient();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("id,slug,name")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  const packageSlug = (await searchParams).package;
  const requestedSlug = typeof packageSlug === "string" ? packageSlug : undefined;
  const initialPackageId = packages?.find((item) => item.slug === requestedSlug)?.id;
  const proof = createLeadFormProof(getLeadRateLimitSalt());

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold underline underline-offset-4">← Početna</Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Pošaljite upit</h1>
        <p className="mt-4 leading-7 text-[#374c3d]">Ostavite kontakt i javićemo Vam se sa informacijama o BIOTACT paketima i načinu poručivanja.</p>

        {error ? (
          <p role="alert" className="mt-8 rounded-xl border border-red-900/20 bg-red-50 p-4">Pakete trenutno nije moguće učitati. Upit i dalje možete poslati bez izbora paketa.</p>
        ) : null}

        <div className="mt-8">
          <ContactForm
            packages={packages ?? []}
            initialPackageId={initialPackageId}
            formStartedAt={proof.formStartedAt}
            formToken={proof.formToken}
            whatsappLink={createLeadSuccessWhatsAppLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
          />
        </div>
      </div>
    </main>
  );
}
