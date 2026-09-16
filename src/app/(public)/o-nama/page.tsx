import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama",
  description: "Transparentno o BIOTACT wellness podršci i odnosu sa LR Health & Beauty portfoliom.",
  alternates: { canonical: "/o-nama" },
  openGraph: { title: "O nama | BIOTACT", description: "Kako BIOTACT pruža wellness i korisničku podršku.", url: "/o-nama" },
};

const principles = [
  ["01", "Jasna organizacija", "Odabrani proizvodi i paketi predstavljeni su kroz pregledne kategorije."],
  ["02", "Transparentne informacije", "Važne informacije prikazujemo sažeto, bez preuveličanih obećanja."],
  ["03", "Lična podrška", "Kada je potrebno, razgovor pomaže da sledeći korak bude jasniji."],
] as const;

const steps = [
  ["01", "Istraži", "Upoznaj proizvode i pakete kroz jasno organizovan portfolio."],
  ["02", "Uporedi", "Pregledaj dostupne informacije i pronađi opcije za svoju rutinu."],
  ["03", "Kontaktiraj nas", "Pošalji upit za dodatne informacije i ličnu podršku."],
] as const;

export default function AboutPage() {
  return (
    <main id="glavni-sadrzaj" className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="eyebrow">O BIOTACT-U</p>
          <h1 id="about-title">Jednostavniji način da upoznaš LR portfolio.</h1>
          <p>BIOTACT organizuje i predstavlja odabrane LR Health &amp; Beauty proizvode kroz jasnije iskustvo koje je lakše istražiti.</p>
        </div>
        <div className="about-hero-mark" aria-hidden="true">
          <span>BT</span>
          <p>Jasnoća · organizacija · podrška</p>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="approach-title">
        <div className="about-section-heading">
          <p className="eyebrow">Naš pristup</p>
          <h2 id="approach-title">Manje haosa. Više jasnoće.</h2>
        </div>
        <div className="about-principles-grid">
          {principles.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-process" aria-labelledby="process-title">
        <div className="about-section-heading">
          <p className="eyebrow">Kako BIOTACT funkcioniše</p>
          <h2 id="process-title">Od pregleda do razgovora.</h2>
        </div>
        <ol>
          {steps.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-transparency" aria-labelledby="transparency-title">
        <p className="eyebrow">Transparentno o poreklu</p>
        <h2 id="transparency-title">Jasno razdvajamo brend i proizvođača.</h2>
        <p>BIOTACT predstavlja i distribuira proizvode iz LR Health &amp; Beauty portfolija. BIOTACT nije proizvođač prikazanih LR proizvoda.</p>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <p className="eyebrow">Sledeći korak</p>
        <h2 id="about-cta-title">Spreman da istražiš portfolio?</h2>
        <div>
          <Link href="/proizvodi" className="button-gold">Pogledaj proizvode</Link>
          <Link href="/paketi" className="button-outline-light">Pogledaj pakete</Link>
        </div>
      </section>
    </main>
  );
}
