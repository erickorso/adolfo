"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  forgotPasswordAction,
  type ForgotPasswordResult,
} from "@/app/[locale]/forgot-password/actions";
import { Button } from "@/components/ui/button";

const INITIAL: ForgotPasswordResult = {};

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    INITIAL,
  );

  if (state.success) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("forgotSent")}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{t("forgotHint")}</p>
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
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("forgotSending") : t("forgotCta")}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
