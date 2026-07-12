import type { JobQuery, NormalizedJob } from "@/domain/jobs/job.types";

/** Vacantes visibles en el listado público: remotas, JS/Node, últimos 10 días. */

const MADRID_PATTERN = /madrid/i;

/** Ventana de publicación / frescura (10 días). */
export const ACTIVE_JOB_MAX_AGE_MS = 10 * 24 * 60 * 60 * 1000;

/** Keywords para título: solo stack JS/Node/FE relevante al perfil. */
export const JS_NODE_JOB_QUERY_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "nextjs",
  "node",
  "node.js",
  "nodejs",
  "frontend",
  "front-end",
  "full stack",
  "fullstack",
] as const;

export function matchesJsNodeJobText(title: string, description?: string | null): boolean {
  const haystack = `${title} ${description ?? ""}`.toLowerCase();
  return JS_NODE_JOB_QUERY_KEYWORDS.some((kw) => haystack.includes(kw));
}

/** @deprecated Usar matchesJsNodeJobText */
export function matchesJsNodeJobTitle(title: string): boolean {
  return matchesJsNodeJobText(title, null);
}

export function isWithinActiveJobWindow(
  postedAt: Date | null,
  fetchedAt: Date,
  now = Date.now(),
): boolean {
  const anchor = postedAt ?? fetchedAt;
  return now - anchor.getTime() <= ACTIVE_JOB_MAX_AGE_MS;
}

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
  postedAt?: Date | null;
}): boolean {
  if (job.hidden) {
    return false;
  }
  return isWithinActiveJobWindow(job.postedAt ?? null, job.fetchedAt);
}

export function isPublicJobListing(job: {
  remote: boolean;
  hidden: boolean;
  location?: string | null;
  title?: string;
  description?: string | null;
  fetchedAt: Date;
  postedAt?: Date | null;
}): boolean {
  return (
    job.remote &&
    !isMadridJob(job) &&
    matchesJsNodeJobText(job.title ?? "", job.description) &&
    isActiveJobPosting(job)
  );
}

export function isEligibleNormalizedJob(job: {
  remote: boolean;
  location?: string | null;
  title?: string;
  description?: string | null;
  postedAt?: Date | null;
}): boolean {
  if (!job.remote || isMadridJob(job)) {
    return false;
  }
  if (!matchesJsNodeJobText(job.title ?? "", job.description)) {
    return false;
  }
  if (job.postedAt && !isWithinActiveJobWindow(job.postedAt, job.postedAt)) {
    return false;
  }
  return true;
}

/** Cláusula Prisma: título o descripción matchea stack JS/Node. */
export function jsNodeTitleWhereClause() {
  const titleOrDescription = JS_NODE_JOB_QUERY_KEYWORDS.flatMap((kw) => [
    { title: { contains: kw, mode: "insensitive" as const } },
    { description: { contains: kw, mode: "insensitive" as const } },
  ]);
  return { OR: titleOrDescription };
}

/** Filtro de keywords en ingesta (título + descripción + company). */
export function matchesJobIngestQuery(
  job: Pick<NormalizedJob, "title" | "company" | "description" | "remote">,
  query: JobQuery,
): boolean {
  if (query.remoteOnly && !job.remote) {
    return false;
  }
  if (query.keywords && query.keywords.length > 0) {
    const haystack =
      `${job.title} ${job.company} ${job.description ?? ""}`.toLowerCase();
    return query.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
  }
  return true;
}

/** Cláusula Prisma: publicada o ingestada en los últimos 10 días. */
export function recentJobWhereClause() {
  const minDate = new Date(Date.now() - ACTIVE_JOB_MAX_AGE_MS);
  return {
    OR: [
      { postedAt: { gte: minDate } },
      { postedAt: null, fetchedAt: { gte: minDate } },
    ],
  };
}
