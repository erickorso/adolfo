"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  resetPasswordAction,
  type ResetPasswordResult,
} from "@/app/[locale]/reset-password/actions";
import { Button } from "@/components/ui/button";

const INITIAL: ResetPasswordResult = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    INITIAL,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
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
          autoComplete="new-password"
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("resetSaving") : t("resetCta")}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
