import { getTranslations } from "next-intl/server";
import { ApplicationAddForm } from "@/components/molecules/application-add-form";
import { ApplicationsKanban } from "@/components/organisms/applications-kanban";
import type { JobApplicationVM } from "@/domain/job-applications/job-application.types";

type ApplicationsManagerProps = {
  applications: JobApplicationVM[];
  stats: { total: number; applied: number; active: number };
};

/** Organismo: Kanban + stats + formulario de alta. */
export async function ApplicationsManager({
  applications,
  stats,
}: ApplicationsManagerProps) {
  const t = await getTranslations("applications");
  const defaultAppliedAt = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border border-border p-3">
          <dt className="text-muted-foreground">{t("statTotal")}</dt>
          <dd className="text-2xl font-semibold">{stats.total}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-muted-foreground">{t("statApplied")}</dt>
          <dd className="text-2xl font-semibold">{stats.applied}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-muted-foreground">{t("statActive")}</dt>
          <dd className="text-2xl font-semibold">{stats.active}</dd>
        </div>
      </dl>

      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ApplicationsKanban applications={applications} />
      )}

      <ApplicationAddForm defaultAppliedAt={defaultAppliedAt} />
    </div>
  );
}
