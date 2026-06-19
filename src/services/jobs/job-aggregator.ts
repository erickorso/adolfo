import "server-only";
import { prisma } from "@/lib/prisma";
import type { JobQuery, JobSource } from "@/domain/jobs/job.types";
import { dedupeJobs, normalizedToData } from "./job.mapper";

/**
 * Orquestador de ingesta. Corre todas las fuentes, deduplica y persiste
 * (upsert idempotente por source+externalId). No conoce ninguna fuente concreta
 * — recibe la lista de `JobSource`, así que agregar portales no lo modifica.
 */
export async function ingestJobs(
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
