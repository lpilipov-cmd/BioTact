import Link from "next/link";

export default function PackageNotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl border border-[#17301f]/15 bg-white/70 p-8 text-center">
        <h1 className="text-2xl font-bold">Paket nije pronađen.</h1>
        <p className="mt-2 text-[#5b6960]">Proverite adresu ili se vratite na listu paketa.</p>
        <Link href="/admin/packages" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#17301f] px-4 font-semibold text-[#f7f3ea]">
          Nazad na pakete
        </Link>
      </section>
    </main>
  );
}
