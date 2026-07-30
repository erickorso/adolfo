import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  ingestDisabledResponse,
  ingestUnauthorizedResponse,
  isIngestAuthorized,
} from "@/lib/ingest-auth";
import { rotateImagenSemana } from "@/services/catalog/imagen-semana-rotate.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guardIngest(request: Request): NextResponse | null {
  if (!env.JOBS_INGEST_SECRET) {
    return ingestDisabledResponse();
  }
  if (!isIngestAuthorized(request)) {
    return ingestUnauthorizedResponse();
  }
  return null;
}

/** Cron semanal: rota la foto del producto `imagen-semana`. */
export async function GET(request: Request): Promise<NextResponse> {
  const denied = guardIngest(request);
  if (denied) {
    return denied;
  }
  const result = await rotateImagenSemana();
  return NextResponse.json(result);
}

export async function POST(request: Request): Promise<NextResponse> {
  const denied = guardIngest(request);
  if (denied) {
    return denied;
  }
  const result = await rotateImagenSemana();
  return NextResponse.json(result);
}
