"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "./actions";
import { initialLoginState } from "./login-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 min-h-12 w-full rounded-xl bg-[#17301f] px-5 py-3 font-semibold text-[#f7f3ea] transition hover:bg-[#1f3a28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17301f] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Prijavljivanje..." : "Prijavi se"}
    </button>
  );
}

type LoginFormProps = Readonly<{
  initialMessage?: string | null;
}>;

export function LoginForm({ initialMessage = null }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, {
    ...initialLoginState,
    message: initialMessage,
  });

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email adresa
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#17301f]/25 bg-white px-4 py-3 text-base outline-none transition focus:border-[#17301f] focus:ring-2 focus:ring-[#17301f]/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Lozinka
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={1024}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#17301f]/25 bg-white px-4 py-3 text-base outline-none transition focus:border-[#17301f] focus:ring-2 focus:ring-[#17301f]/20"
        />
      </div>

      {state.message ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
