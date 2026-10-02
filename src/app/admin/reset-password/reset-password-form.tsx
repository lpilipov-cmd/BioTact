"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { resetPasswordAction } from "./actions";
import { initialResetPasswordState } from "./reset-password-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 w-full rounded-xl bg-[#17301f] px-5 py-3 font-semibold text-[#f7f3ea] transition hover:bg-[#1f3a28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17301f] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Čuvanje..." : "Sačuvaj novu lozinku"}
    </button>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialResetPasswordState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Nova lozinka
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={72}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#17301f]/25 bg-white px-4 py-3 text-base outline-none transition focus:border-[#17301f] focus:ring-2 focus:ring-[#17301f]/20"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold">
          Potvrdite novu lozinku
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={72}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#17301f]/25 bg-white px-4 py-3 text-base outline-none transition focus:border-[#17301f] focus:ring-2 focus:ring-[#17301f]/20"
        />
      </div>

      <p className="text-sm leading-6 text-[#5b6960]">
        Koristite najmanje 12 znakova, uključujući slovo i broj.
      </p>

      {state.message ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
