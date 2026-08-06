import type { Metadata } from "next";
import Link from "next/link";

import { FeaturedPackages } from "@/components/public/featured-packages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { absolute: "BIOTACT | Priroda. Nauka. Poverenje." },
  description: "BIOTACT povezuje odgovornu wellness podršku, aktivne pakete i lični kontakt bez direktne internet prodaje.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BIOTACT | Priroda. Nauka. Poverenje.",
    description: "Odgovorna wellness podrška i lični kontakt.",
    url: "/",
  },
};

const trustItems = [
  ["Prirodno", "Promišljen pristup svakodnevnoj wellness rutini."],
  ["Naučno", "Jasne informacije bez preuveličanih obećanja."],
  ["Sigurno", "Odgovorna komunikacija i kontrolisane tvrdnje."],
  ["Lična podrška", "Kontakt sa osobom, ne automatska kupovina."],
] as const;

export default async function Home() {
  const supabase = await createClient();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("slug,name,category,description,price_rsd")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(3);

  return (
    <main id="glavni-sadrzaj">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div aria-hidden="true" className="absolute -right-28 top-6 size-80 rounded-full border border-[#c9a24d]/30 bg-[#e4c874]/10 sm:size-[30rem]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="eyebrow">Wellness podrška sa merom</p>
          <h1 className="mt-5 max-w-4xl text-6xl font-black tracking-[-0.04em] sm:text-7xl lg:text-8xl">BIOTACT</h1>
          <p className="mt-4 font-serif text-3xl italic text-[#476050] sm:text-4xl">Priroda. Nauka. Poverenje.</p>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#374c3d]">Pomažemo Vam da upoznate dostupne wellness pakete, dobijete jasne informacije i završite poručivanje kroz lični kontakt.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/paketi" className="button-primary">Pogledaj pakete</Link>
            <Link href="/kontakt" className="button-secondary">Pošalji upit</Link>
          </div>
        </div>
      </section>

      <section aria-label="Načela BIOTACT podrške" className="border-y border-[#17301f]/10 bg-[#eae1cb]/60 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(([title, description], index) => (
            <article key={title} className="grid grid-cols-[auto_1fr] gap-4">
              <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full border border-[#c9a24d] font-serif text-[#8b6925]">{index + 1}</span>
              <div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-[#5b6960]">{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell" aria-labelledby="featured-packages-title">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Aktuelna ponuda</p><h2 id="featured-packages-title" className="section-title">Izdvojeni paketi</h2></div>
          <Link href="/paketi" className="font-bold underline underline-offset-4">Pogledajte sve pakete →</Link>
        </div>

        <FeaturedPackages packages={packages ?? []} unavailable={Boolean(error)} />
      </section>

      <section className="bg-[#17301f] px-4 py-20 text-[#f7f3ea] sm:px-6 lg:px-8" aria-labelledby="how-it-works-title">
        <div className="mx-auto max-w-7xl"><p className="eyebrow text-[#e4c874]">Jednostavan proces</p><h2 id="how-it-works-title" className="mt-3 text-4xl font-bold sm:text-5xl">Kako funkcioniše</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[["01", "Izaberite paket", "Pregledajte samo trenutno aktivne BIOTACT pakete."], ["02", "Pošaljite upit", "Ostavite kontakt i pitanje, bez kupovine ili plaćanja na sajtu."], ["03", "Dobijate ličnu podršku", "Javljamo Vam se sa informacijama i narednim koracima."]].map(([number, title, text]) => (
              <li key={number} className="rounded-2xl border border-[#f7f3ea]/15 p-6"><span className="font-serif text-3xl text-[#e4c874]">{number}</span><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-[#f7f3ea]/70">{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center" aria-labelledby="responsible-title">
        <p aria-hidden="true" className="font-serif text-8xl text-[#c9a24d]/55 sm:text-9xl">*</p>
        <div><p className="eyebrow">Odgovoran wellness</p><h2 id="responsible-title" className="section-title">Informacije bez nerealnih obećanja</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#476050]">Dodaci ishrani nisu zamena za raznovrsnu ishranu, zdrav način života ili medicinski savet. Ako imate zdravstveno stanje, koristite terapiju, trudni ste ili dojite, razgovarajte sa lekarom ili farmaceutom pre upotrebe.</p></div>
      </section>

      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#c9a24d]/40 bg-[#eae1cb] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div><p className="eyebrow">Tu smo za pitanja</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Razgovarajmo o Vašoj wellness rutini.</h2><p className="mt-3 text-[#476050]">Pošaljite upit bez obaveze kupovine.</p></div>
          <Link href="/kontakt" className="button-primary mt-7 shrink-0 lg:mt-0">Pošalji upit</Link>
        </div>
      </section>
    </main>
  );
}
