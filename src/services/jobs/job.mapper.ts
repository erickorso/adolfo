import type { JobPosting } from "@/generated/prisma/client";
import type { JobVM, NormalizedJob } from "@/domain/jobs/job.types";

/** Mappers puros del módulo de empleos (sin prisma ni server-only). */

/** Campos persistibles de una vacante normalizada (para create/update). */
export function normalizedToData(job: NormalizedJob) {
  return {
    source: job.source,
    externalId: job.externalId,
    company: job.company,
    title: job.title,
    location: job.location,
    remote: job.remote,
    url: job.url,
    description: job.description,
    postedAt: job.postedAt,
  };
}

/** Vacante de la DB -> view model para la UI. */
export function jobToVM(job: JobPosting): JobVM {
  return {
    id: job.id,
    source: job.source,
    company: job.company,
    title: job.title,
    location: job.location,
    remote: job.remote,
    url: job.url,
    postedAt: job.postedAt,
  };
}

/** Deduplica vacantes normalizadas por (source, externalId). */
export function dedupeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Map<string, NormalizedJob>();
  for (const job of jobs) {
    seen.set(`${job.source}:${job.externalId}`, job);
  }
  return [...seen.values()];
}
