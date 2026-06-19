import { JobList } from "@/components/organisms/job-list";
import type { JobVM } from "@/domain/jobs/job.types";

type JobsTemplateProps = {
  jobs: JobVM[];
};

/**
 * Template del módulo de empleos: encabezado + lista. Solo layout; recibe los
 * VMs ya resueltos por la página.
 */
export function JobsTemplate({ jobs }: JobsTemplateProps) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Empleos</h1>
        <p className="text-neutral-600">
          Vacantes agregadas desde fuentes oficiales (Greenhouse y más).
        </p>
      </header>
      <JobList jobs={jobs} />
    </main>
  );
}
