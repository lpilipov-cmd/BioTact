"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdministrator } from "@/lib/auth/admin";
import { packageFormInput, packageFormSchema } from "@/lib/packages/validation";

import type { PackageFormState } from "./package-state";

const packageIdSchema = z.uuid();

function invalidState(error: z.ZodError): PackageFormState {
  return {
    status: "error",
    message: "Proverite označena polja.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function createPackageAction(
  _previousState: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  const { supabase } = await requireAdministrator();
  const parsed = packageFormSchema.safeParse(packageFormInput(formData));

  if (!parsed.success) return invalidState(parsed.error);

  const value = parsed.data;
  const { data, error } = await supabase
    .from("packages")
    .insert({
      name: value.name,
      slug: value.slug,
      category: value.category,
      description: value.description,
      product_codes: value.productCodes,
      price_rsd: value.priceRsd,
      active: value.active,
      sort_order: value.sortOrder,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message:
        error?.code === "23505"
          ? "Paket sa ovim slugom već postoji."
          : "Paket nije sačuvan. Pokušajte ponovo.",
    };
  }

  revalidatePath("/admin/packages");
  revalidatePath("/paketi");
  redirect(`/admin/packages/${data.id}?created=1`);
}

export async function updatePackageAction(
  _previousState: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  const { supabase } = await requireAdministrator();
  const packageId = packageIdSchema.safeParse(formData.get("packageId"));
  const parsed = packageFormSchema.safeParse(packageFormInput(formData));

  if (!packageId.success || !parsed.success) {
    return !parsed.success
      ? invalidState(parsed.error)
      : { status: "error", message: "Paket nije ispravan." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("packages")
    .select("slug")
    .eq("id", packageId.data)
    .maybeSingle();

  if (existingError || !existing) {
    return { status: "error", message: "Paket nije pronađen." };
  }

  const value = parsed.data;
  const { data, error } = await supabase
    .from("packages")
    .update({
      name: value.name,
      slug: value.slug,
      category: value.category,
      description: value.description,
      product_codes: value.productCodes,
      price_rsd: value.priceRsd,
      active: value.active,
      sort_order: value.sortOrder,
    })
    .eq("id", packageId.data)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message:
        error?.code === "23505"
          ? "Paket sa ovim slugom već postoji."
          : "Izmene nisu sačuvane. Pokušajte ponovo.",
    };
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${packageId.data}`);
  revalidatePath("/paketi");
  revalidatePath(`/paketi/${existing.slug}`);
  revalidatePath(`/paketi/${value.slug}`);

  return { status: "success", message: "Paket je uspešno sačuvan." };
}
