import "server-only";
import { prisma } from "@/lib/prisma";
import type { JobDetailVM, JobQuery, JobVM } from "@/domain/jobs/job.types";
import { jobToDetailVM, jobToVM } from "./job.mapper";

/**
 * Lectura del catálogo de empleos ya ingestado. La UI consume esto (nunca pega
 * a las fuentes en vivo): la ingesta corre aparte y persiste en la DB.
 */
export async function listJobs(query: JobQuery = {}): Promise<JobVM[]> {
  const jobs = await prisma.jobPosting.findMany({
    where: {
      hidden: false,
      ...(query.remoteOnly ? { remote: true } : {}),
      ...(query.keywords && query.keywords.length > 0
        ? {
            OR: query.keywords.map((kw) => ({
              title: { contains: kw, mode: "insensitive" as const },
            })),
          }
        : {}),
    },
    orderBy: [{ postedAt: "desc" }, { fetchedAt: "desc" }],
    take: 100,
  });

  return jobs.map(jobToVM);
}

/** Detalle de una vacante por id (con descripción) o null si no existe. */
export async function getJobDetail(id: string): Promise<JobDetailVM | null> {
  const job = await prisma.jobPosting.findUnique({ where: { id } });
  return job ? jobToDetailVM(job) : null;
}
