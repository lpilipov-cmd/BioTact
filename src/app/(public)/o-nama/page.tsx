import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama",
  description: "Transparentno o BIOTACT wellness podršci i odnosu sa LR Health & Beauty portfoliom.",
  alternates: { canonical: "/o-nama" },
  openGraph: { title: "O nama | BIOTACT", description: "Kako BIOTACT pruža wellness i korisničku podršku.", url: "/o-nama" },
};

export default function AboutPage() {
  return (
    <main id="glavni-sadrzaj">
      <section className="section-shell max-w-5xl">
        <p className="eyebrow">O BIOTACT-u</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">Lična podrška, transparentan proces.</h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-[#476050]">BIOTACT je wellness brend i mesto korisničke podrške za ljude koji žele jasne informacije i lični kontakt pre odluke o poručivanju.</p>
      </section>

      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="premium-card"><p className="eyebrow">Naša uloga</p><h2 className="mt-3 text-2xl font-bold">Informisanje i podrška</h2><p className="mt-4 leading-8 text-[#476050]">Pomažemo pri izboru dostupnog paketa, odgovaramo na praktična pitanja i usmeravamo korisnika kroz odgovarajući proces poručivanja.</p></article>
          <article className="premium-card"><p className="eyebrow">Poreklo proizvoda</p><h2 className="mt-3 text-2xl font-bold">LR Health &amp; Beauty portfolio</h2><p className="mt-4 leading-8 text-[#476050]">Proizvodi predstavljeni kroz BIOTACT dolaze iz portfolija LR Health &amp; Beauty. BIOTACT nije proizvođač tih proizvoda.</p></article>
          <article className="premium-card"><p className="eyebrow">Poručivanje</p><h2 className="mt-3 text-2xl font-bold">Bez internet naplate</h2><p className="mt-4 leading-8 text-[#476050]">Upiti i poručivanje završavaju se kroz lični kontakt i odgovarajući LR proces. Na ovom sajtu nema korpe, checkout-a niti direktnog plaćanja.</p></article>
          <article className="premium-card"><p className="eyebrow">Odgovorna komunikacija</p><h2 className="mt-3 text-2xl font-bold">Bez preuveličanih tvrdnji</h2><p className="mt-4 leading-8 text-[#476050]">Ne obećavamo lečenje, garantovane rezultate ili zaradu. Wellness informacije ne zamenjuju savet kvalifikovanog zdravstvenog stručnjaka.</p></article>
        </div>
        <div className="mx-auto mt-10 max-w-5xl rounded-3xl bg-[#17301f] p-8 text-[#f7f3ea] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10"><div><h2 className="text-2xl font-bold">Imate pitanje?</h2><p className="mt-2 text-[#f7f3ea]/70">Pošaljite upit i javićemo Vam se lično.</p></div><Link href="/kontakt" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#f7f3ea] px-6 font-bold text-[#17301f] sm:mt-0">Kontaktirajte nas</Link></div>
      </section>
    </main>
  );
}
