"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JOB_APPLICATION_STATUSES } from "@/domain/job-applications/job-application.types";
import {
  createJobApplicationAction,
  type ActionResult,
} from "@/app/[locale]/account/applications/actions";

const initialState: ActionResult = { ok: false };

type ApplicationAddFormProps = {
  jobPostingId?: string;
  defaultCompany?: string;
  defaultTitle?: string;
  defaultUrl?: string;
  defaultSource?: string;
  defaultAppliedAt: string;
};

/**
 * Formulario para registrar una postulación manual o prellenada desde una vacante.
 */
export function ApplicationAddForm({
  jobPostingId,
  defaultCompany = "",
  defaultTitle = "",
  defaultUrl = "",
  defaultSource = "",
  defaultAppliedAt,
}: ApplicationAddFormProps) {
  const t = useTranslations("applications");
  const [state, formAction, pending] = useActionState(
    createJobApplicationAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-dashed border-input p-4"
    >
      <h2 className="text-sm font-semibold">{t("addTitle")}</h2>

      {jobPostingId ? (
        <input type="hidden" name="jobPostingId" value={jobPostingId} />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-company">{t("company")}</Label>
          <Input
            id="application-company"
            name="company"
            required
            defaultValue={defaultCompany}
            autoComplete="organization"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-title">{t("role")}</Label>
          <Input
            id="application-title"
            name="title"
            required
            defaultValue={defaultTitle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-url">{t("url")}</Label>
          <Input
            id="application-url"
            name="url"
            type="url"
            defaultValue={defaultUrl}
            placeholder="https://"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-source">{t("source")}</Label>
          <Input
            id="application-source"
            name="source"
            defaultValue={defaultSource}
            placeholder={t("sourcePlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-status">{t("status")}</Label>
          <select
            id="application-status"
            name="status"
            defaultValue="APPLIED"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {JOB_APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status_${status}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-applied-at">{t("appliedAt")}</Label>
          <Input
            id="application-applied-at"
            name="appliedAt"
            type="date"
            defaultValue={defaultAppliedAt}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="application-next-step">{t("nextStep")}</Label>
        <Input id="application-next-step" name="nextStep" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="application-notes">{t("notes")}</Label>
        <textarea
          id="application-notes"
          name="notes"
          rows={3}
          aria-label={t("notes")}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("savedOk")}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
