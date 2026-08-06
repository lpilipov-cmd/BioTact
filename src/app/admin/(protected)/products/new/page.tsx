import Link from "next/link";
import { ProductForm } from "../product-form";
export default function NewProductPage(){return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><Link href="/admin/products" className="font-semibold underline">← Nazad na proizvode</Link><h1 className="mt-5 text-3xl font-bold">Novi proizvod</h1><ProductForm mode="create"/></main>}
