import type { PrismaClient } from "@/generated/prisma/client";
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
  const results = await Promise.all(
    sources.map((source) => source.fetchJobs(query)),
  );
  const unique = dedupeJobs(results.flat());

  for (const job of unique) {
    const data = normalizedToData(job);
    await prisma.jobPosting.upsert({
      where: {
        source_externalId: { source: job.source, externalId: job.externalId },
      },
      create: { ...data, fetchedAt: new Date() },
      update: { ...data, fetchedAt: new Date() },
    });
  }

  return { ingested: unique.length };
}
