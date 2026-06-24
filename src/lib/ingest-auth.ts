import { NextResponse } from "next/server";
import "server-only";
import { env } from "@/lib/env";

/** Valida Bearer para endpoints de ingesta (POST manual o GET cron Vercel). */
export function isIngestAuthorized(request: Request): boolean {
  const secret = env.JOBS_INGEST_SECRET;
  if (!secret) {
    return false;
  }

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) {
    return true;
  }

  // Vercel Cron envía Authorization: Bearer <CRON_SECRET>
  if (env.CRON_SECRET && auth === `Bearer ${env.CRON_SECRET}`) {
    return true;
  }

  return false;
}

export function ingestDisabledResponse(): NextResponse {
  return NextResponse.json(
    { error: "Ingesta deshabilitada (configurar JOBS_INGEST_SECRET)" },
    { status: 403 },
  );
}

export function ingestUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}
