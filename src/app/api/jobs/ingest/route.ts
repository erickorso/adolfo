import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { GreenhouseSource } from "@/services/jobs/sources/greenhouse.source";
import { ingestJobs } from "@/services/jobs/job-aggregator";

// Prisma (driver pg) requiere runtime Node, no edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dispara la ingesta de empleos. Pensado para un cron (Vercel Cron, GitHub
 * Actions, etc.). Protegido por un bearer secret; si no está configurado,
 * el endpoint queda deshabilitado.
 *
 * Uso: POST /api/jobs/ingest  con header Authorization: Bearer <JOBS_INGEST_SECRET>
 */
export async function POST(request: Request) {
  const secret = env.JOBS_INGEST_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Ingesta deshabilitada (configurar JOBS_INGEST_SECRET)" },
      { status: 403 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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
