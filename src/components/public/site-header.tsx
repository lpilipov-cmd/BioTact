"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Početna" },
  { href: "/paketi", label: "Paketi" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#17301f]/10 bg-[#f1ead9]/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="BIOTACT početna" className="shrink-0 text-xl font-black tracking-[0.2em]">
          BIOTACT
        </Link>

        <nav aria-label="Glavna navigacija" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-[#17301f]/8 aria-[current=page]:bg-[#17301f]/10 aria-[current=page]:text-[#17301f]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/kontakt" className="ml-3 inline-flex min-h-11 items-center rounded-xl bg-[#17301f] px-5 text-sm font-bold text-[#f7f3ea] transition hover:bg-[#1f3a28]">
            Pošalji upit
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#17301f]/30 px-3 text-sm font-bold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-public-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Zatvori meni" : "Otvori meni"}</span>
          <span aria-hidden="true" className="text-xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-public-navigation"
          aria-label="Mobilna navigacija"
          className="border-t border-[#17301f]/10 px-4 pb-4 pt-3 md:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-[#17301f]/8 aria-[current=page]:bg-[#17301f]/10"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/kontakt" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#17301f] px-5 font-bold text-[#f7f3ea]">
              Pošalji upit
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
