import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { ingestRates } from "@/services/rates/rate.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Refresca la cotización (cron). Protegido por el mismo bearer secret que la
 * ingesta de empleos. El read-through cache igual la actualiza on-demand, pero
 * este endpoint permite mantenerla fresca proactivamente.
 *
 * POST /api/rates/ingest  con Authorization: Bearer <JOBS_INGEST_SECRET>
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

  const result = await ingestRates();
  return NextResponse.json(result);
}
