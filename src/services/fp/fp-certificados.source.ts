import {
  FP_JCYL_API_BASE,
  FP_JCYL_PAGE_SIZE,
} from "@/domain/fp/fp.constants";
import type { NormalizedFpCertificate } from "@/domain/fp/fp.types";
import {
  mapJcylRecordToFp,
  type JcylFpRecord,
} from "@/services/fp/fp-ingest.mapper";

type JcylPage = {
  total_count: number;
  results: JcylFpRecord[];
};

async function fetchJcylPage(offset: number): Promise<JcylPage> {
  const url = new URL(FP_JCYL_API_BASE);
  url.searchParams.set("limit", String(FP_JCYL_PAGE_SIZE));
  url.searchParams.set("offset", String(offset));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`JCyL FP API ${response.status} (${url.toString()})`);
  }
  return (await response.json()) as JcylPage;
}

/** Descarga todo el catálogo de certificados profesionales (JCyL → SEPE). */
export async function fetchAllFpCertificates(): Promise<
  NormalizedFpCertificate[]
> {
  const first = await fetchJcylPage(0);
  const pages = [first.results];
  let offset = FP_JCYL_PAGE_SIZE;

  while (offset < first.total_count) {
    const page = await fetchJcylPage(offset);
    pages.push(page.results);
    offset += FP_JCYL_PAGE_SIZE;
  }

  const mapped = pages
    .flat()
    .map(mapJcylRecordToFp)
    .filter((row): row is NormalizedFpCertificate => row !== null);

  const byId = new Map<string, NormalizedFpCertificate>();
  for (const row of mapped) {
    byId.set(row.externalId, row);
  }
  return [...byId.values()];
}
