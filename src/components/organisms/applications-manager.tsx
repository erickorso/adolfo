import { getTranslations } from "next-intl/server";
import { ApplicationAddForm } from "@/components/molecules/application-add-form";
import { ApplicationRow } from "@/components/molecules/application-row";
import type { JobApplicationVM } from "@/domain/job-applications/job-application.types";

type ApplicationsManagerProps = {
  applications: JobApplicationVM[];
  stats: { total: number; applied: number; active: number };
};

/** Organismo: pipeline de postulaciones + formulario de alta. */
export async function ApplicationsManager({
  applications,
  stats,
}: ApplicationsManagerProps) {
  const t = await getTranslations("applications");

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
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t("company")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
                <th className="px-3 py-2 font-medium">{t("appliedAt")}</th>
                <th className="px-3 py-2 font-medium">{t("url")}</th>
                <th className="px-3 py-2 font-medium">{t("notes")}</th>
                <th className="px-3 py-2 font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ApplicationAddForm />
    </div>
  );
}
