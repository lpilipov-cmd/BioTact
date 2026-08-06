"use client";

import { useActionState, useState } from "react";

import { packageCategories, packageCategoryLabels } from "@/lib/packages/constants";
import { findMedicalClaims, normalizePackageSlug } from "@/lib/packages/validation";
import type { Tables } from "@/lib/supabase/database.types";

import { createPackageAction, updatePackageAction } from "./actions";
import { initialPackageFormState } from "./package-state";

type PackageRow = Tables<"packages">;

type PackageFormProps = Readonly<{
  mode: "create" | "edit";
  packageData?: Pick<
    PackageRow,
    | "id"
    | "name"
    | "slug"
    | "category"
    | "description"
    | "product_codes"
    | "price_rsd"
    | "active"
    | "sort_order"
  >;
}>;

export function PackageForm({ mode, packageData }: PackageFormProps) {
  const action = mode === "create" ? createPackageAction : updatePackageAction;
  const [state, formAction, pending] = useActionState(action, initialPackageFormState);
  const [name, setName] = useState(packageData?.name ?? "");
  const [description, setDescription] = useState(packageData?.description ?? "");
  const [slugSource, setSlugSource] = useState(packageData?.slug ?? "");
  const [category, setCategory] = useState(packageData?.category ?? "imunitet");
  const [priceRsd, setPriceRsd] = useState(packageData?.price_rsd?.toString() ?? "");
  const [sortOrder, setSortOrder] = useState(packageData?.sort_order.toString() ?? "0");
  const [productCodes, setProductCodes] = useState(packageData?.product_codes.join("\n") ?? "");
  const [active, setActive] = useState(packageData?.active ?? true);
  const claims = findMedicalClaims(description);

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {packageData ? <input type="hidden" name="packageId" value={packageData.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Naziv" error={fieldError("name")}>
          <input
            name="name"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Slug" error={fieldError("slug")} hint={`Biće sačuvan kao: ${normalizePackageSlug(slugSource) || "—"}`}>
          <input
            name="slug"
            required
            maxLength={100}
            value={slugSource}
            onChange={(event) => setSlugSource(event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Kategorija" error={fieldError("category")}>
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field-input"
          >
            {packageCategories.map((category) => (
              <option key={category} value={category}>
                {packageCategoryLabels[category]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cena (RSD)" error={fieldError("priceRsd")} hint="Ostavite prazno za „Cena na upit”.">
          <input
            name="priceRsd"
            type="number"
            min="1"
            step="1"
            value={priceRsd}
            onChange={(event) => setPriceRsd(event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Redosled" error={fieldError("sortOrder")}>
          <input
            name="sortOrder"
            type="number"
            min="0"
            step="1"
            required
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="field-input"
          />
        </Field>
        <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-[#17301f]/20 bg-white px-4 py-3 font-semibold">
          <input
            name="active"
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="size-5 accent-[#17301f]"
          />
          Aktivno i javno vidljivo
        </label>
      </div>

      <Field
        label="Šifre proizvoda"
        error={fieldError("productCodes")}
        hint="Unesite jednu šifru po redu ili ih razdvojite zarezom."
      >
        <textarea
          name="productCodes"
          rows={4}
          required
          value={productCodes}
          onChange={(event) => setProductCodes(event.target.value)}
          className="field-input resize-y"
        />
      </Field>

      <Field label="Opis" error={fieldError("description")} hint={`${description.length}/2000 znakova`}>
        <textarea
          name="description"
          rows={8}
          required
          maxLength={2000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="field-input resize-y"
        />
      </Field>

      <div
        role={claims.length ? "alert" : "status"}
        className={`rounded-xl border p-4 text-sm ${
          claims.length
            ? "border-red-800/30 bg-red-50 text-red-900"
            : "border-[#17301f]/20 bg-[#f7f3ea] text-[#476050]"
        }`}
      >
        <p className="font-bold">
          {claims.length ? "Opis sadrži rizičnu medicinsku tvrdnju." : "Podsetnik pre čuvanja"}
        </p>
        <p className="mt-1">
          {claims.length
            ? `Ispravite: ${claims.join(", ")}. Paket neće biti sačuvan dok opis nije neutralan.`
            : "Ne navodite lečenje, dijagnozu, terapiju ili garantovane rezultate. Koristite neutralne izraze poput „podržava”."}
        </p>
      </div>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm ${
            state.status === "error" ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || claims.length > 0}
        className="min-h-12 rounded-xl bg-[#17301f] px-6 font-bold text-[#f7f3ea] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {pending ? "Čuvanje…" : mode === "create" ? "Kreiraj paket" : "Sačuvaj izmene"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: Readonly<{
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
      {error ? <span className="font-normal text-red-800">{error}</span> : null}
      {!error && hint ? <span className="font-normal text-[#5b6960]">{hint}</span> : null}
    </label>
  );
}
