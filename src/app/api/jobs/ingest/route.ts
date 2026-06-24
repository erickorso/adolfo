import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  ingestDisabledResponse,
  ingestUnauthorizedResponse,
  isIngestAuthorized,
} from "@/lib/ingest-auth";
import { GreenhouseSource } from "@/services/jobs/sources/greenhouse.source";
import { ingestJobs } from "@/services/jobs/job-aggregator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dispara la ingesta de empleos (cron Vercel GET o POST manual).
 * Authorization: Bearer <JOBS_INGEST_SECRET> o Bearer <CRON_SECRET>
 */
async function runJobsIngest(): Promise<NextResponse> {
  const boards = env.JOBS_GREENHOUSE_BOARDS.split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (boards.length === 0) {
    return NextResponse.json(
      { error: "Sin boards configurados (JOBS_GREENHOUSE_BOARDS)" },
      { status: 400 },
    );
  }

  const source = new GreenhouseSource(boards);
  const result = await ingestJobs([source]);
  return NextResponse.json(result);
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
