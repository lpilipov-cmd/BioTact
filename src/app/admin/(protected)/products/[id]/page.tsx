import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdministrator } from "@/lib/auth/admin";
import { ProductForm } from "../product-form";
type Props=Readonly<{params:Promise<{id:string}>}>;
export default async function EditProductPage({params}:Props){const id=z.uuid().safeParse((await params).id);if(!id.success)notFound();const {supabase}=await requireAdministrator();const {data:product,error}=await supabase.from("products").select("*").eq("id",id.data).maybeSingle();if(error||!product)notFound();const {data:commercial}=await supabase.schema("private").from("product_commercial_data").select("*").eq("product_id",id.data).maybeSingle();return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><Link href="/admin/products" className="font-semibold underline">← Nazad na proizvode</Link><h1 className="mt-5 text-3xl font-bold">Uredi proizvod</h1><ProductForm mode="edit" product={product} commercial={commercial}/></main>}
