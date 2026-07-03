import type { PrismaClient } from "@/generated/prisma/client";
import { isEligibleNormalizedJob } from "@/domain/jobs/job-filters";
import type { JobQuery, JobSource } from "@/domain/jobs/job.types";
import { dedupeJobs, normalizedToData } from "./job.mapper";

/**
 * Orquestador de ingesta (sin server-only; usable desde scripts CLI).
 * Corre fuentes, deduplica y persiste upsert por source+externalId.
 */
export async function runJobIngest(
  prisma: PrismaClient,
  sources: JobSource[],
  query: JobQuery = {},
): Promise<{ ingested: number }> {
  const ingestStartedAt = new Date();
  const results = await Promise.all(
    sources.map((source) => source.fetchJobs(query)),
  );
  const unique = dedupeJobs(results.flat());
  const eligible = unique.filter(isEligibleNormalizedJob);

  for (const job of eligible) {
    const data = normalizedToData(job);
    await prisma.jobPosting.upsert({
      where: {
        source_externalId: { source: job.source, externalId: job.externalId },
      },
      create: { ...data, fetchedAt: ingestStartedAt, hidden: false },
      update: { ...data, fetchedAt: ingestStartedAt, hidden: false },
    });
  }

  await prisma.jobPosting.updateMany({
    where: { fetchedAt: { lt: ingestStartedAt } },
    data: { hidden: true },
  });

  await prisma.jobPosting.updateMany({
    where: {
      OR: [
        { remote: false },
        { location: { contains: "madrid", mode: "insensitive" } },
        { title: { contains: "madrid", mode: "insensitive" } },
      ],
    },
    data: { hidden: true },
  });

  return { ingested: eligible.length };
}
