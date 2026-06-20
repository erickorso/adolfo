"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  uploadResumeAction,
  type ActionResult,
} from "@/app/[locale]/account/cvs/actions";
import { MAX_RESUMES } from "@/services/resume/resume.policy";

const INITIAL: ActionResult = { ok: false };

type ResumeUploadFormProps = {
  /** Deshabilita el form cuando se alcanzó el máximo de CVs. */
  disabled: boolean;
};

/**
 * Molécula: formulario de subida de CV. Usa useActionState (React 19) con la
 * Server Action; muestra el estado pendiente y los errores de validación.
 */
export function ResumeUploadForm({ disabled }: ResumeUploadFormProps) {
  const t = useTranslations("cvs");
  const [state, formAction, pending] = useActionState(
    uploadResumeAction,
    INITIAL,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(t("uploaded"));
    }
  }, [state.ok, t]);

  if (disabled) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("limitReached", { max: MAX_RESUMES })}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="label" className="text-sm font-medium">
          {t("nameLabel")}
        </label>
        <input
          id="label"
          name="label"
          type="text"
          placeholder={t("namePlaceholder")}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="file" className="text-sm font-medium">
          {t("fileLabel")}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t("uploading") : t("uploadCta")}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="text-sm text-green-700">{t("uploaded")}</p>
      ) : null}
    </form>
  );
}
