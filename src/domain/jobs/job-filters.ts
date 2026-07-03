/** Vacantes visibles en el listado público: remotas, sin Madrid y no ocultas. */

const MADRID_PATTERN = /madrid/i;
/** Ventana de frescura: alineada al cron semanal + margen. */
export const ACTIVE_JOB_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export function isMadridJob(job: {
  location?: string | null;
  title?: string;
}): boolean {
  const text = `${job.location ?? ""} ${job.title ?? ""}`;
  return MADRID_PATTERN.test(text);
}

export function isActiveJobPosting(job: {
  hidden: boolean;
  fetchedAt: Date;
}): boolean {
  if (job.hidden) {
    return false;
  }
  return Date.now() - job.fetchedAt.getTime() <= ACTIVE_JOB_MAX_AGE_MS;
}

export function isPublicJobListing(job: {
  remote: boolean;
  hidden: boolean;
  location?: string | null;
  title?: string;
  fetchedAt: Date;
}): boolean {
  return (
    job.remote &&
    !isMadridJob(job) &&
    isActiveJobPosting(job)
  );
}

export function isEligibleNormalizedJob(job: {
  remote: boolean;
  location?: string | null;
  title?: string;
}): boolean {
  return job.remote && !isMadridJob(job);
}
