"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "./actions";

const links = [
  { href: "/admin", label: "Početna" },
  { href: "/admin/leads", label: "Leadovi" },
  { href: "/admin/packages", label: "Paketi" },
  { href: "/admin/products", label: "Proizvodi" },
] as const;

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#17301f]/15 bg-[#f7f3ea]/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/admin" className="font-bold tracking-[0.18em]">
          BIOTACT
        </Link>
        <nav aria-label="Administratorska navigacija" className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#17301f] text-[#f7f3ea]"
                    : "hover:bg-[#17301f]/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#17301f]/10"
            >
              Odjavi se
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
