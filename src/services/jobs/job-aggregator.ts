import "server-only";
import { prisma } from "@/lib/prisma";
import type { JobQuery, JobSource } from "@/domain/jobs/job.types";
import { runJobIngest } from "./job-ingest.core";

/** Wrapper server para la ingesta de empleos. */
export async function ingestJobs(
  sources: JobSource[],
  query: JobQuery = {},
): Promise<{ ingested: number }> {
  return runJobIngest(prisma, sources, query);
}
