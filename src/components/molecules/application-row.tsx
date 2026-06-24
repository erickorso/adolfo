import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import {
  deleteJobApplicationAction,
  updateJobApplicationStatusAction,
} from "@/app/[locale]/account/applications/actions";
import { JOB_APPLICATION_STATUSES } from "@/domain/job-applications/job-application.types";
import type { JobApplicationVM } from "@/domain/job-applications/job-application.types";

type ApplicationRowProps = {
  application: JobApplicationVM;
};

/** Fila de postulación con cambio de estado y eliminar. */
export async function ApplicationRow({ application }: ApplicationRowProps) {
  const t = await getTranslations("applications");

  return (
    <tr className="border-t border-border align-top">
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{application.company}</span>
          <span className="text-sm text-muted-foreground">{application.title}</span>
          {application.source ? (
            <span className="text-xs text-muted-foreground">{application.source}</span>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-3">
        <form
          action={updateJobApplicationStatusAction}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input type="hidden" name="applicationId" value={application.id} />
          <label className="sr-only" htmlFor={`status-${application.id}`}>
            {t("status")}
          </label>
          <select
            id={`status-${application.id}`}
            name="status"
            defaultValue={application.status}
            className="h-8 min-w-[8rem] rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {JOB_APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status_${status}`)}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">
            {t("updateStatus")}
          </Button>
        </form>
      </td>
      <td className="px-3 py-3 text-muted-foreground">
        {application.appliedAt ? formatDate(application.appliedAt) : "—"}
      </td>
      <td className="px-3 py-3">
        {application.url ? (
          <a
            href={application.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline"
          >
            {t("viewOffer")}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2">
          {application.nextStep ? (
            <Badge variant="secondary">{application.nextStep}</Badge>
          ) : null}
          {application.notes ? (
            <p className="max-w-xs text-xs text-muted-foreground">{application.notes}</p>
          ) : null}
          {!application.nextStep && !application.notes ? (
            <span className="text-muted-foreground">—</span>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-3">
        <form action={deleteJobApplicationAction}>
          <input type="hidden" name="applicationId" value={application.id} />
          <Button type="submit" variant="ghost" size="sm">
            {t("delete")}
          </Button>
        </form>
      </td>
    </tr>
  );
}
