import { getTranslations } from "next-intl/server";
import { JobCard } from "@/components/molecules/job-card";
import type { JobVM } from "@/domain/jobs/job.types";

type JobListProps = {
  jobs: JobVM[];
};

/**
 * Organismo: lista de vacantes con estado vacío.
 */
export async function JobList({ jobs }: JobListProps) {
  const t = await getTranslations("jobs");

  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <li key={job.id} className="flex">
          <div className="w-full">
            <JobCard job={job} />
          </div>
        </li>
      ))}
    </ul>
  );
}
