"use client";
import { useActionState, useState } from "react";
import { findMedicalClaims } from "@/lib/packages/validation";
import { productCategories, productCategoryLabels } from "@/lib/products/validation";
import type { Tables } from "@/lib/supabase/database.types";
import { createProductAction, updateProductAction } from "./actions";
import { initialProductFormState } from "./product-state";

type Product=Tables<"products">; type Commercial=Tables<{ schema: "private" }, "product_commercial_data">;
export function ProductForm({mode,product,commercial}:{mode:"create"|"edit";product?:Product;commercial?:Commercial|null}) {
 const action=mode==="create"?createProductAction:updateProductAction; const [state,formAction,pending]=useActionState(action,initialProductFormState); const [description,setDescription]=useState(product?.short_description??""); const claims=findMedicalClaims(description); const error=(name:string)=>state.fieldErrors?.[name]?.[0];
 return <form action={formAction} className="mt-8 space-y-6">{product?<input type="hidden" name="productId" value={product.id}/>:null}<div className="grid gap-5 sm:grid-cols-2">
  <Field label="Naziv" error={error("name")}><input className="field-input" name="name" required maxLength={160} defaultValue={product?.name}/></Field>
  <Field label="Slug" error={error("slug")} hint="Koristi mala slova i crtice."><input className="field-input" name="slug" required maxLength={120} defaultValue={product?.slug}/></Field>
  <Field label="Broj artikla" error={error("articleNumber")}><input className="field-input" name="articleNumber" required maxLength={40} defaultValue={product?.article_number}/></Field>
  <Field label="Izvorna kataloška šifra" error={error("catalogueSourceCode")}><input className="field-input" name="catalogueSourceCode" maxLength={80} defaultValue={product?.catalogue_source_code??""}/></Field>
  <Field label="Kategorija" error={error("category")}><select className="field-input" name="category" defaultValue={product?.category??"zdravlje"}>{productCategories.map(x=><option key={x} value={x}>{productCategoryLabels[x]}</option>)}</select></Field>
  <Field label="Potkategorija" error={error("subcategory")}><input className="field-input" name="subcategory" maxLength={100} defaultValue={product?.subcategory??""}/></Field>
  <Field label="Sadržaj pakovanja" error={error("packageContent")}><input className="field-input" name="packageContent" maxLength={120} defaultValue={product?.package_content??""}/></Field>
  <Field label="Kataloška cena EUR" error={error("cataloguePriceEur")}><input className="field-input" name="cataloguePriceEur" inputMode="decimal" placeholder="57.88" defaultValue={product?.catalogue_price_eur?.toFixed(2)??""}/></Field>
  <Field label="Partnerska cena EUR" error={error("partnerPriceEur")}><input className="field-input" name="partnerPriceEur" inputMode="decimal" defaultValue={commercial?.partner_price_eur?.toFixed(2)??""}/></Field>
  <Field label="Poeni" error={error("points")}><input className="field-input" name="points" inputMode="decimal" defaultValue={commercial?.points?.toFixed(2)??""}/></Field>
  <Field label="Cena važi od" error={error("priceValidFrom")}><input className="field-input" name="priceValidFrom" type="date" defaultValue={product?.price_valid_from??commercial?.source_price_valid_from??""}/></Field>
  <Field label="Redosled" error={error("sortOrder")}><input className="field-input" name="sortOrder" type="number" min="0" step="1" defaultValue={product?.sort_order??0}/></Field>
  <Field label="Lokalna putanja slike" error={error("imagePath")}><input className="field-input" name="imagePath" placeholder="/products/80700/product.webp" defaultValue={product?.image_path??""}/></Field>
  <Field label="Izvor slike URL" error={error("imageSourceUrl")}><input className="field-input" name="imageSourceUrl" type="url" defaultValue={product?.image_source_url??""}/></Field>
  <Field label="Izvor proizvoda URL" error={error("productSourceUrl")}><input className="field-input" name="productSourceUrl" type="url" defaultValue={product?.product_source_url??""}/></Field>
  <label className="flex items-center gap-3 self-end rounded-xl border p-3 font-semibold"><input type="checkbox" name="active" defaultChecked={product?.active??false}/>Aktivno i javno vidljivo</label>
 </div><Field label="Kratak opis" error={error("shortDescription")} hint={`${description.length}/2000`}><textarea className="field-input" name="shortDescription" rows={7} maxLength={2000} value={description} onChange={e=>setDescription(e.target.value)}/></Field>
 <p role={claims.length?"alert":"status"} className={`rounded-xl p-4 text-sm ${claims.length?"bg-red-50 text-red-900":"bg-[#f7f3ea] text-[#476050]"}`}>{claims.length?`Ispravite medicinske tvrdnje: ${claims.join(", ")}.`:"Koristite neutralan opis bez tvrdnji o lečenju ili garantovanom rezultatu."}</p>
 {state.message?<p role={state.status==="error"?"alert":"status"}>{state.message}</p>:null}<button className="button-primary" disabled={pending||claims.length>0}>{pending?"Čuvanje…":mode==="create"?"Kreiraj proizvod":"Sačuvaj izmene"}</button>
 </form>;
}
function Field({label,error,hint,children}:{label:string;error?:string;hint?:string;children:React.ReactNode}) {return <label className="grid gap-2 text-sm font-semibold">{label}{children}{error?<span className="font-normal text-red-800">{error}</span>:hint?<span className="font-normal text-[#5b6960]">{hint}</span>:null}</label>}
