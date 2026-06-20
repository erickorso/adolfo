"use client";

import { useActionState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { signupAction, type SignupResult } from "@/app/[locale]/signup/actions";
import { Button } from "@/components/ui/button";

const INITIAL: SignupResult = {};

/** Formulario de registro (email + contraseña + Google opcional). */
export function SignupForm({ googleEnabled }: { googleEnabled: boolean }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(signupAction, INITIAL);

  const handleGoogle = useCallback(() => {
    void signIn("google", { callbackUrl: "/" });
  }, []);

  return (
    <form action={action} className="flex flex-col gap-3">
      {googleEnabled ? (
        <>
          <Button type="button" variant="outline" onClick={handleGoogle}>
            {t("google")}
          </Button>
          <div className="text-center text-xs text-muted-foreground">
            {t("or")}
          </div>
        </>
      ) : null}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          {t("passwordMin")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("creating") : t("signupCta")}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}
