"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteJobApplicationAction,
  updateJobApplicationAction,
  type ActionResult,
} from "@/app/[locale]/account/applications/actions";
import {
  JOB_APPLICATION_STATUSES,
  type JobApplicationDetailVM,
} from "@/domain/job-applications/job-application.types";

const initialState: ActionResult = { ok: false };

type ApplicationDetailFormProps = {
  application: Pick<
    JobApplicationDetailVM,
    "id" | "status" | "nextStep" | "notes"
  >;
};

/** Formulario de edición en la página de detalle. */
export function ApplicationDetailForm({ application }: ApplicationDetailFormProps) {
  const t = useTranslations("applications");
  const [state, formAction, pending] = useActionState(
    updateJobApplicationAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">{t("editTitle")}</h2>
        <input type="hidden" name="applicationId" value={application.id} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="detail-status">{t("status")}</Label>
          <select
            id="detail-status"
            name="status"
            defaultValue={application.status}
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
          <Label htmlFor="detail-next-step">{t("nextStep")}</Label>
          <Input
            id="detail-next-step"
            name="nextStep"
            defaultValue={application.nextStep ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="detail-notes">{t("notes")}</Label>
          <textarea
            id="detail-notes"
            name="notes"
            rows={4}
            defaultValue={application.notes ?? ""}
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
            {t("updatedOk")}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? t("saving") : t("saveChanges")}
        </Button>
      </form>

      <form action={deleteJobApplicationAction}>
        <input type="hidden" name="applicationId" value={application.id} />
        <Button type="submit" variant="destructive" size="sm">
          {t("delete")}
        </Button>
      </form>
    </div>
  );
}
