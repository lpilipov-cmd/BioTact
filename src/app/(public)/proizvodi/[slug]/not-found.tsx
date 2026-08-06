import Link from "next/link";
export default function NotFound() { return <main className="min-h-screen px-4 py-16"><section className="mx-auto max-w-xl"><h1 className="text-3xl font-bold">Proizvod nije pronađen.</h1><Link href="/proizvodi" className="button-secondary mt-6">Nazad na proizvode</Link></section></main>; }
