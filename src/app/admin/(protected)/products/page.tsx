import Image from "next/image";
import Link from "next/link";

import imageReview from "@/../data/lr-health-product-images-review.json";
import { requireAdministrator } from "@/lib/auth/admin";
import { formatEurPrice } from "@/lib/products/format";

type Props = Readonly<{ searchParams: Promise<{ q?: string }> }>;
const imageByArticle = new Map(imageReview.products.map((item) => [item.article_number, item]));

export default async function AdminProductsPage({ searchParams }: Props) {
  const { supabase } = await requireAdministrator();
  const q = (await searchParams).q?.trim().slice(0, 80) ?? "";
  let query = supabase.from("products").select("id,name,article_number,active,catalogue_price_eur,price_valid_from,image_path,image_source_url").order("sort_order").order("name");
  if (q) query = query.or(`name.ilike.%${q.replaceAll(",", "")}%,article_number.ilike.%${q.replaceAll(",", "")}%`);
  const { data, error } = await query;
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Administracija</p><h1 className="mt-2 text-3xl font-bold">Proizvodi</h1></div><div className="flex flex-wrap gap-3"><Link className="button-secondary" href="/admin/products/preview">Pregled kataloga</Link><Link className="button-primary" href="/admin/products/new">Novi proizvod</Link></div></div><form className="mt-6 flex gap-2" role="search"><input className="field-input max-w-md" name="q" defaultValue={q} placeholder="Naziv ili broj artikla"/><button className="button-secondary">Pretraži</button></form>
    {error ? <p role="alert" className="mt-6">Proizvode nije moguće učitati.</p> : data?.length ? <div className="mt-6 overflow-x-auto"><table className="w-full min-w-5xl text-left"><thead><tr><th className="p-3">Slika</th><th className="p-3">Artikal</th><th className="p-3">Naziv</th><th className="p-3">Status</th><th className="p-3">Cena</th><th className="p-3">Provera slike</th><th className="p-3">Izvor / putanja</th><th className="p-3"></th></tr></thead><tbody>{data.map((item) => { const review = imageByArticle.get(item.article_number); return <tr key={item.id} className="border-t align-top"><td className="p-3">{item.image_path ? <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white"><Image src={item.image_path} alt="" fill className="object-contain p-1" sizes="64px" /></div> : <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[#eae1cb] text-center text-[10px]">Nema slike</span>}</td><td className="p-3 font-mono">{item.article_number}</td><td className="p-3 font-semibold">{item.name}</td><td className="p-3">{item.active ? "Aktivan" : "Neaktivan"}</td><td className="p-3">{formatEurPrice(item.catalogue_price_eur)}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${review?.image_status === "verified" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{review?.image_status === "verified" ? "Potvrđena" : "Nerešena"}</span></td><td className="max-w-xs p-3 text-xs"><p className="break-all font-mono">{item.image_path ?? "Nema lokalne putanje"}</p><p className="mt-2 text-[#5b6960]">{review?.source_type === "lr_web" ? "LR web" : review?.source_type === "health_mission_pdf" ? "Health Mission PDF" : "Izvor nije potvrđen"}</p></td><td className="p-3"><Link className="underline" href={`/admin/products/${item.id}`}>Uredi</Link></td></tr>; })}</tbody></table></div> : <section className="empty-state"><h2 className="text-xl font-bold">Još nema proizvoda.</h2><p className="mt-2">Kreirajte prvi proizvod kada sadržaj bude spreman za proveru.</p></section>}
  </main>;
}
