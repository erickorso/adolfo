import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  ingestDisabledResponse,
  ingestUnauthorizedResponse,
  isIngestAuthorized,
} from "@/lib/ingest-auth";
import { DEFAULT_JOB_INGEST_QUERY } from "@/services/jobs/job-ingest.config";
import { ingestJobs } from "@/services/jobs/job-aggregator";
import { resolveJobSources } from "@/services/jobs/resolve-job-sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dispara la ingesta de empleos (cron Vercel GET o POST manual).
 * Authorization: Bearer <JOBS_INGEST_SECRET> o Bearer <CRON_SECRET>
 */
async function runJobsIngest(): Promise<NextResponse> {
  const sources = resolveJobSources();
  const result = await ingestJobs(sources, DEFAULT_JOB_INGEST_QUERY);
  return NextResponse.json({ ...result, sources: sources.map((s) => s.name) });
}

function guardIngest(request: Request): NextResponse | null {
  if (!env.JOBS_INGEST_SECRET) {
    return ingestDisabledResponse();
  }
  if (!isIngestAuthorized(request)) {
    return ingestUnauthorizedResponse();
  }
  return null;
}

export async function GET(request: Request): Promise<NextResponse> {
  const denied = guardIngest(request);
  if (denied) {
    return denied;
  }
  return runJobsIngest();
}

export async function POST(request: Request): Promise<NextResponse> {
  const denied = guardIngest(request);
  if (denied) {
    return denied;
  }
  return runJobsIngest();
}
