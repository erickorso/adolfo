import { JobCard } from "@/components/molecules/job-card";
import type { JobVM } from "@/domain/jobs/job.types";

type JobListProps = {
  jobs: JobVM[];
};

/**
 * Organismo: lista de vacantes con estado vacío.
 */
export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay vacantes todavía. Corré la ingesta para traer ofertas.
      </p>
    );
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
