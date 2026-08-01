import "server-only";
import { prisma } from "@/lib/prisma";
import { FP_CERTIFICADO_SOURCE } from "@/domain/fp/fp.constants";
import type { FpCertificateVM, FpSearchQuery } from "@/domain/fp/fp.vm";
import type { FpCertificate } from "@/generated/prisma/client";

function toVM(row: FpCertificate): FpCertificateVM {
  return {
    id: row.id,
    externalId: row.externalId,
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
  };
}

function buildWhere(query: FpSearchQuery) {
  const q = query.q?.trim();
  return {
    hidden: false,
    source: FP_CERTIFICADO_SOURCE,
    ...(query.level === 1 || query.level === 2 || query.level === 3
      ? { level: query.level }
      : {}),
    ...(typeof query.requiresBachiller === "boolean"
      ? { requiresBachiller: query.requiresBachiller }
      : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { externalId: { contains: q, mode: "insensitive" as const } },
            { family: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

/** Listado público de FP cortos (certificados profesionales). */
export async function searchFpCertificates(
  query: FpSearchQuery = {},
): Promise<FpCertificateVM[]> {
  const rows = await prisma.fpCertificate.findMany({
    where: buildWhere(query),
    orderBy: [{ level: "asc" }, { family: "asc" }, { title: "asc" }],
    take: 200,
  });
  return rows.map(toVM);
}

export async function countFpCertificates(
  query: FpSearchQuery = {},
): Promise<number> {
  return prisma.fpCertificate.count({ where: buildWhere(query) });
}
