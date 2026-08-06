import Link from "next/link";

export default function PublicPackageNotFound() {
  return (
    <main id="glavni-sadrzaj" className="min-h-screen px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#17301f]/15 bg-white/70 p-8 text-center">
        <h1 className="text-2xl font-bold">Paket nije pronađen.</h1>
        <p className="mt-2 text-[#5b6960]">Paket nije dostupan ili više nije aktivan.</p>
        <Link href="/paketi" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#17301f] px-4 font-semibold text-[#f7f3ea]">Pogledaj aktivne pakete</Link>
      </section>
    </main>
  );
}
