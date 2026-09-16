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
  const selectedPackage = initialPackageId
    ? packages?.find((item) => item.id === initialPackageId)
    : undefined;
  const selectedProduct = initialProductId
    ? products?.find((item) => item.id === initialProductId)
    : undefined;
  const whatsappLink = createLeadSuccessWhatsAppLink(env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  return (
    <main id="glavni-sadrzaj" className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-title">
        <p className="eyebrow">KONTAKT</p>
        <h1 id="contact-title">Tu smo da ti pomognemo da napraviš sledeći korak.</h1>
        <p>Pošalji kratak upit i javićemo se sa jasnim informacijama o proizvodima, paketima i procesu poručivanja.</p>
      </section>

      <section className="contact-layout" aria-label="Kontakt forma i informacije">
        <aside className="contact-aside">
          <div>
            <p className="eyebrow">Kako nastavljamo</p>
            <h2>Lični odgovor, bez komplikovanja.</h2>
            <p>Pregledaćemo upit i odgovoriti putem kontakta koji ostaviš u formi.</p>
          </div>
          <div className="contact-channel-note">
            <span aria-hidden="true">01</span>
            <p>{whatsappLink ? "Nakon slanja upita možeš nastaviti razgovor i putem WhatsApp-a." : "Kontakt počinje slanjem ove forme."}</p>
          </div>
          <p className="contact-expectation">Slanje forme predstavlja upit za informacije i kontakt — nije samostalna kartična kupovina.</p>
        </aside>

        <div className="contact-form-column">
          {packageError || productError ? (
            <p role="alert" className="contact-load-error">Opcije trenutno nije moguće učitati. Upit i dalje možeš poslati bez izbora.</p>
          ) : null}
          <ContactForm
            packages={packages ?? []}
            products={products ?? []}
            initialPackageId={initialPackageId}
            initialProductId={initialProductId}
            selectedContext={selectedPackage
              ? { kind: "Paket", name: selectedPackage.name }
              : selectedProduct
                ? { kind: "Proizvod", name: selectedProduct.name }
                : undefined}
            formStartedAt={proof.formStartedAt}
            formToken={proof.formToken}
            whatsappLink={whatsappLink}
          />
        </div>
      </section>
    </main>
  );
}
