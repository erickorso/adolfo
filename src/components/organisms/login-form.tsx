"use client";

import { useActionState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import {
  loginAction,
  type LoginResult,
} from "@/app/[locale]/login/actions";
import { Button } from "@/components/ui/button";

const INITIAL: LoginResult = {};

type LoginFormProps = {
  googleEnabled: boolean;
  callbackUrl: string;
  defaultEmail?: string;
};

/** Login con Server Action (Credentials) + Google opcional en cliente. */
export function LoginForm({
  googleEnabled,
  callbackUrl,
  defaultEmail = "",
}: LoginFormProps) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  const handleGoogle = useCallback(() => {
    void signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return (
    <form action={action} method="post" className="flex flex-col gap-3">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaultEmail}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            {t("password")}
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-muted-foreground underline"
          >
            {t("forgotLink")}
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("loggingIn") : t("loginCta")}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error === "Email o contraseña incorrectos."
            ? t("invalidCredentials")
            : state.error}
        </p>
      ) : null}
    </form>
  );
}
