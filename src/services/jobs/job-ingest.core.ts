import type { PrismaClient } from "@/generated/prisma/client";
import {
  isEligibleNormalizedJob,
  JS_NODE_JOB_QUERY_KEYWORDS,
  keywordTitleWhereClause,
  recentJobWhereClause,
} from "@/domain/jobs/job-filters";
import type { JobQuery, JobSource } from "@/domain/jobs/job.types";
import { dedupeJobs, normalizedToData } from "./job.mapper";

/**
 * Orquestador de ingesta (sin server-only; usable desde scripts CLI).
 * Corre fuentes, deduplica y persiste upsert por source+externalId.
 * `query.keywords` define el scope vivo (default: JS/Node).
 */
export async function runJobIngest(
  prisma: PrismaClient,
  sources: JobSource[],
  query: JobQuery = {},
): Promise<{ ingested: number }> {
  const ingestStartedAt = new Date();
  const scopeQuery: JobQuery = {
    keywords:
      query.keywords && query.keywords.length > 0
        ? query.keywords
        : [...JS_NODE_JOB_QUERY_KEYWORDS],
    remoteOnly: query.remoteOnly ?? true,
  };
  const results = await Promise.all(
    sources.map((source) => source.fetchJobs(scopeQuery)),
  );
  const unique = dedupeJobs(results.flat());
  const eligible = unique.filter((job) =>
    isEligibleNormalizedJob(job, scopeQuery),
  );

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
        { NOT: keywordTitleWhereClause(scopeQuery.keywords!) },
        { NOT: recentJobWhereClause() },
      ],
    },
    data: { hidden: true },
  });

  return { ingested: eligible.length };
}
