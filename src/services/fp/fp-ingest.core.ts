import type { PrismaClient } from "@/generated/prisma/client";
import { FP_CERTIFICADO_SOURCE } from "@/domain/fp/fp.constants";
import type { FpIngestResult } from "@/domain/fp/fp.types";
import { fetchAllFpCertificates } from "@/services/fp/fp-certificados.source";

/**
 * Ingesta FP cortos (certificados profesionales).
 * Independiente de Course / seed de cursos.
 */
export async function runFpIngest(
  prisma: PrismaClient,
): Promise<FpIngestResult> {
  const ingestStartedAt = new Date();
  const rows = await fetchAllFpCertificates();

  for (const row of rows) {
    await prisma.fpCertificate.upsert({
      where: {
        source_externalId: {
          source: FP_CERTIFICADO_SOURCE,
          externalId: row.externalId,
        },
      },
      create: {
        ...row,
        fetchedAt: ingestStartedAt,
        hidden: false,
      },
      update: {
        title: row.title,
        description: row.description,
        family: row.family,
        level: row.level,
        requiresBachiller: row.requiresBachiller,
        hours: row.hours,
        modality: row.modality,
        url: row.url,
        programUrl: row.programUrl,
        teleformation: row.teleformation,
        provider: row.provider,
        location: row.location,
        fetchedAt: ingestStartedAt,
        hidden: false,
      },
    });
  }

  const stale = await prisma.fpCertificate.updateMany({
    where: {
      source: FP_CERTIFICADO_SOURCE,
      fetchedAt: { lt: ingestStartedAt },
    },
    data: { hidden: true },
  });

  return {
    ingested: rows.length,
    hiddenStale: stale.count,
    source: FP_CERTIFICADO_SOURCE,
  };
}
