import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link href="/"><strong>BIOTACT</strong><span>Priroda. Nauka. Poverenje.</span></Link>
          <p>Odgovorno predstavljen wellness portfolio i lična podrška pri izboru.</p>
        </div>
        <nav aria-label="Navigacija u podnožju" className="site-footer-navigation">
          <Link href="/proizvodi">Proizvodi</Link>
          <Link href="/paketi">Paketi</Link>
          <Link href="/o-nama">O nama</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
        <div className="site-footer-transparency"><p>BIOTACT predstavlja proizvode iz LR Health & Beauty portfolija. BIOTACT nije proizvođač prikazanih LR proizvoda.</p><p>Upiti i poručivanje završavaju se kroz lični kontakt i odgovarajući LR proces.</p></div>
      </div>
      <div className="site-footer-bottom"><p>Dodaci ishrani nisu zamena za raznovrsnu ishranu i zdrav način života. Informacije na sajtu ne zamenjuju savet lekara ili drugog kvalifikovanog zdravstvenog stručnjaka.</p><span>© BIOTACT. Sva prava zadržana.</span></div>
    </footer>
  );
}
