import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import {
  PIPELINE_STATUSES,
  type JobApplicationDetailVM,
  pipelineProgressIndex,
} from "@/domain/job-applications/job-application.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type ApplicationProgressProps = {
  application: JobApplicationDetailVM;
};

/** Stepper del pipeline + línea de tiempo de cambios de estado. */
export async function ApplicationProgress({
  application,
}: ApplicationProgressProps) {
  const t = await getTranslations("applications");
  const currentIdx = pipelineProgressIndex(application.status);
  const isClosed =
    application.status === "REJECTED" || application.status === "GHOSTED";

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="mb-3 text-sm font-semibold">
          {t("progressTitle")}
        </h2>
        <ol className="flex flex-wrap gap-2">
          {PIPELINE_STATUSES.map((step, index) => {
            const done = !isClosed && currentIdx >= index;
            const current = application.status === step;
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                  done && "border-primary bg-primary/10 text-primary",
                  current && "ring-2 ring-primary",
                  !done && !current && "border-border text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                    done ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
                {t(`status_${step}`)}
              </li>
            );
          })}
        </ol>
        {isClosed ? (
          <p className="mt-2">
            <Badge variant="secondary">{t(`status_${application.status}`)}</Badge>
          </p>
        ) : null}
      </section>

      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="mb-3 text-sm font-semibold">
          {t("timelineTitle")}
        </h2>
        <ol className="relative border-s border-border ps-4">
          {application.statusLogs.map((log) => (
            <li key={log.id} className="mb-4 last:mb-0">
              <span
                className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-background bg-primary"
                aria-hidden
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {t(`status_${log.status}`)}
                </span>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={log.createdAt.toISOString()}
                >
                  {formatDate(log.createdAt)}
                </time>
                {log.note ? (
                  <span className="text-xs text-muted-foreground">{log.note}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
