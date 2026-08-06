"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdministrator } from "@/lib/auth/admin";
import { productFormInput, productFormSchema } from "@/lib/products/validation";
import type { ProductFormState } from "./product-state";

const idSchema = z.uuid();
const decimalForDatabase = (value: string | null) => value as unknown as number | null;
function invalid(error: z.ZodError): ProductFormState { return { status: "error", message: "Proverite označena polja.", fieldErrors: error.flatten().fieldErrors }; }
function publicValues(value: z.output<typeof productFormSchema>) { return { name:value.name, slug:value.slug, article_number:value.articleNumber, catalogue_source_code:value.catalogueSourceCode, category:value.category, subcategory:value.subcategory, short_description:value.shortDescription, package_content:value.packageContent, catalogue_price_eur:decimalForDatabase(value.cataloguePriceEur), currency:"EUR", price_valid_from:value.priceValidFrom, image_path:value.imagePath, image_source_url:value.imageSourceUrl, product_source_url:value.productSourceUrl, active:value.active, sort_order:value.sortOrder }; }
function commercialValues(productId:string, value:z.output<typeof productFormSchema>) { return { product_id:productId, partner_price_eur:decimalForDatabase(value.partnerPriceEur), points:decimalForDatabase(value.points), source_price_valid_from:value.priceValidFrom }; }

export async function createProductAction(_:ProductFormState, formData:FormData):Promise<ProductFormState> {
  const { supabase }=await requireAdministrator(); const parsed=productFormSchema.safeParse(productFormInput(formData)); if(!parsed.success)return invalid(parsed.error);
  const { data, error }=await supabase.from("products").insert(publicValues(parsed.data)).select("id").single();
  if(error||!data)return {status:"error",message:error?.code==="23505"?"Slug ili broj artikla već postoji.":"Proizvod nije sačuvan."};
  const { error:commercialError }=await supabase.schema("private").from("product_commercial_data").insert(commercialValues(data.id,parsed.data));
  if(commercialError)return {status:"error",message:"Javni podaci su sačuvani, ali komercijalni podaci nisu. Otvorite proizvod i pokušajte ponovo."};
  revalidatePath("/admin/products"); revalidatePath("/proizvodi"); redirect(`/admin/products/${data.id}?created=1`);
}
export async function updateProductAction(_:ProductFormState, formData:FormData):Promise<ProductFormState> {
  const { supabase }=await requireAdministrator(); const id=idSchema.safeParse(formData.get("productId")); const parsed=productFormSchema.safeParse(productFormInput(formData)); if(!id.success||!parsed.success)return !parsed.success?invalid(parsed.error):{status:"error",message:"Proizvod nije ispravan."};
  const { error }=await supabase.from("products").update(publicValues(parsed.data)).eq("id",id.data).select("id").single(); if(error)return {status:"error",message:error.code==="23505"?"Slug ili broj artikla već postoji.":"Izmene nisu sačuvane."};
  const { error:commercialError }=await supabase.schema("private").from("product_commercial_data").upsert(commercialValues(id.data,parsed.data)); if(commercialError)return {status:"error",message:"Javni podaci su sačuvani, ali komercijalni podaci nisu."};
  revalidatePath("/admin/products"); revalidatePath(`/admin/products/${id.data}`); revalidatePath("/proizvodi"); revalidatePath(`/proizvodi/${parsed.data.slug}`); return {status:"success",message:"Proizvod je sačuvan."};
}
