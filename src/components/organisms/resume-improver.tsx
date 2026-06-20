"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { improveResumeAction, type ImproveResult } from "@/app/[locale]/jobs/actions";
import type { ResumeVM } from "@/domain/resume/resume.types";

const INITIAL: ImproveResult = { ok: false };

type ResumeImproverProps = {
  jobId: string;
  resumes: ResumeVM[];
};

/**
 * Organismo: asistente de IA para adaptar un CV a la oferta.
 * Elige uno de los CVs del usuario y muestra sugerencias + reescritura.
 */
export function ResumeImprover({ jobId, resumes }: ResumeImproverProps) {
  const t = useTranslations("jobs");
  const [state, formAction, pending] = useActionState(
    improveResumeAction,
    INITIAL,
  );

  const usable = resumes.filter((r) => r.hasText);

  if (usable.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("needPdf")}{" "}
        <Link href="/account/cvs" className="font-medium underline">
          {t("uploadHere")}
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="jobId" value={jobId} />
        <div className="flex flex-col gap-1">
          <label htmlFor="resumeId" className="text-sm font-medium">
            {t("chooseCv")}
          </label>
          <select
            id="resumeId"
            name="resumeId"
            className="rounded-md border border-input px-3 py-2 text-sm"
            defaultValue={usable[0].id}
          >
            {usable.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? t("generating") : t("improveCta")}
        </Button>
      </form>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      {state.ok ? (
        <div className="flex flex-col gap-6">
          <ResultSection
            title={t("suggestions")}
            body={state.suggestions ?? ""}
          />
          <ResultSection title={t("rewrite")} body={state.rewrite ?? ""} />
        </div>
      ) : null}
    </div>
  );
}

/** Render del resultado como texto (Markdown sin interpretar HTML). */
function ResultSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted p-4 font-sans text-sm">
        {body}
      </pre>
    </section>
  );
}
