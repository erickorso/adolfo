import "server-only";
import { prisma } from "@/lib/prisma";
import {
  isPublicJobListing,
  jsNodeTitleWhereClause,
  recentJobWhereClause,
} from "@/domain/jobs/job-filters";
import type { JobDetailVM, JobQuery, JobVM } from "@/domain/jobs/job.types";
import { jobToDetailVM, jobToVM } from "./job.mapper";

function publicListingWhere(query: JobQuery = {}) {
  const keywordFilter =
    query.keywords && query.keywords.length > 0
      ? {
          OR: query.keywords.map((kw) => ({
            title: { contains: kw, mode: "insensitive" as const },
          })),
        }
      : jsNodeTitleWhereClause();

  return {
    hidden: false,
    remote: true,
    AND: [keywordFilter, recentJobWhereClause()],
    NOT: {
      OR: [
        { location: { contains: "madrid", mode: "insensitive" as const } },
        { title: { contains: "madrid", mode: "insensitive" as const } },
      ],
    },
  };
}

/**
 * Lectura del catálogo de empleos ya ingestado. La UI consume esto (nunca pega
 * a las fuentes en vivo): la ingesta corre aparte y persiste en la DB.
 */
export async function listJobs(query: JobQuery = {}): Promise<JobVM[]> {
  const jobs = await prisma.jobPosting.findMany({
    where: publicListingWhere(query),
    orderBy: [{ postedAt: "desc" }, { fetchedAt: "desc" }],
    take: 100,
  });

  return jobs.map(jobToVM);
}

/** Detalle de una vacante por id (con descripción) o null si no existe. */
export async function getJobDetail(id: string): Promise<JobDetailVM | null> {
  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job || !isPublicJobListing(job)) {
    return null;
  }
  return jobToDetailVM(job);
}
