"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CartLink } from "@/components/cart/cart-link";

const links = [
  { href: "/", label: "Početna" },
  { href: "/proizvodi", label: "Proizvodi" },
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
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" aria-label="BIOTACT početna" className="site-brand">
          <span>BIOTACT</span>
          <small>Wellness portfolio</small>
        </Link>

        <nav aria-label="Glavna navigacija" className="site-navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              className="site-navigation-link"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/proizvodi" className="site-header-cta">
            <span>Pronađi proizvod</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <CartLink />

        <button
          type="button"
          className="site-menu-button"
          aria-expanded={open}
          aria-controls="mobile-public-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Zatvori meni" : "Otvori meni"}</span>
          <span aria-hidden="true" className="site-menu-icon">
            <i />
            <i />
          </span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-public-navigation"
          aria-label="Mobilna navigacija"
          className="site-mobile-navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <div className="site-mobile-navigation-inner">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="site-mobile-navigation-link"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/proizvodi" onClick={() => setOpen(false)} className="site-mobile-cta">
              <span>Pronađi proizvod</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
