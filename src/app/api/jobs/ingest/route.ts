import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  ingestDisabledResponse,
  ingestUnauthorizedResponse,
  isIngestAuthorized,
} from "@/lib/ingest-auth";
import { rotateImagenSemana } from "@/services/catalog/imagen-semana-rotate.service";
import { DEFAULT_JOB_INGEST_QUERY } from "@/services/jobs/job-ingest.config";
import { ingestJobs } from "@/services/jobs/job-aggregator";
import { resolveJobSources } from "@/services/jobs/resolve-job-sources";
import type { JobQuery } from "@/domain/jobs/job.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ingestBodySchema = z.object({
  keywords: z.array(z.string().trim().min(1)).min(1).max(40).optional(),
  remoteOnly: z.boolean().optional(),
});

function resolveIngestQuery(body?: z.infer<typeof ingestBodySchema>): JobQuery {
  if (!body?.keywords?.length && body?.remoteOnly === undefined) {
    return DEFAULT_JOB_INGEST_QUERY;
  }
  return {
    keywords: body.keywords?.length
      ? body.keywords
      : DEFAULT_JOB_INGEST_QUERY.keywords,
    remoteOnly: body.remoteOnly ?? DEFAULT_JOB_INGEST_QUERY.remoteOnly,
  };
}

/**
 * Dispara la ingesta de empleos (cron Vercel GET o POST manual).
 * POST puede enviar `{ keywords?: string[], remoteOnly?: boolean }` para scope en vivo.
 * También rota `imagen-semana` (Hobby: máx. 2 crons — se reusa el lunes 06:00).
 * Authorization: Bearer <JOBS_INGEST_SECRET> o Bearer <CRON_SECRET>
 */
async function runJobsIngest(query: JobQuery): Promise<NextResponse> {
  const sources = resolveJobSources();
  const result = await ingestJobs(sources, query);
  const imagenSemana = await rotateImagenSemana();
  return NextResponse.json({
    ...result,
    sources: sources.map((s) => s.name),
    query,
    imagenSemana,
  });
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
  return runJobsIngest(DEFAULT_JOB_INGEST_QUERY);
}

export async function POST(request: Request): Promise<NextResponse> {
  const denied = guardIngest(request);
  if (denied) {
    return denied;
  }

  let body: z.infer<typeof ingestBodySchema> | undefined;
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const raw: unknown = await request.json();
      const parsed = ingestBodySchema.safeParse(raw);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Body inválido", details: parsed.error.flatten() },
          { status: 400 },
        );
      }
      body = parsed.data;
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
  }

  return runJobsIngest(resolveIngestQuery(body));
}
