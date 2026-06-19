import "server-only";
import { prisma } from "@/lib/prisma";
import type { JobQuery, JobVM } from "@/domain/jobs/job.types";
import { jobToVM } from "./job.mapper";

/**
 * Lectura del catálogo de empleos ya ingestado. La UI consume esto (nunca pega
 * a las fuentes en vivo): la ingesta corre aparte y persiste en la DB.
 */
export async function listJobs(query: JobQuery = {}): Promise<JobVM[]> {
  const jobs = await prisma.jobPosting.findMany({
    where: {
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
