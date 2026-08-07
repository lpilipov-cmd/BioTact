import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#f7f3ea]/15 bg-[#17301f] text-[#f7f3ea]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="max-w-xl">
          <Link href="/" className="text-xl font-black tracking-[0.2em]">BIOTACT</Link>
          <p className="mt-4 text-sm leading-7 text-[#f7f3ea]/75">Pregledan put kroz LR wellness portfolio, uz odgovorno informisanje, jasne kataloške cene i lični kontakt.</p>
          <p className="mt-4 text-xs leading-6 text-[#f7f3ea]/65">BIOTACT je wellness i korisnička podrška. Proizvodi pripadaju LR Health & Beauty portfoliju; BIOTACT ih ne proizvodi. Upiti i poručivanje završavaju se kroz lični kontakt i odgovarajući LR proces.</p>
          <p className="mt-5 text-xs leading-6 text-[#f7f3ea]/65">Dodaci ishrani nisu zamena za raznovrsnu ishranu i zdrav način života. Informacije na sajtu ne zamenjuju savet lekara ili drugog kvalifikovanog zdravstvenog stručnjaka.</p>
        </div>
        <nav aria-label="Navigacija u podnožju" className="grid content-start gap-3 text-sm md:justify-self-end">
          <Link href="/" className="underline-offset-4 hover:underline">Početna</Link>
          <Link href="/proizvodi" className="underline-offset-4 hover:underline">Proizvodi</Link>
          <Link href="/paketi" className="underline-offset-4 hover:underline">Paketi</Link>
          <Link href="/o-nama" className="underline-offset-4 hover:underline">O nama</Link>
          <Link href="/kontakt" className="underline-offset-4 hover:underline">Kontakt</Link>
        </nav>
      </div>
      <div className="border-t border-[#f7f3ea]/10 px-4 py-5 text-center text-xs text-[#f7f3ea]/60">© BIOTACT. Sva prava zadržana.</div>
    </footer>
  );
}
