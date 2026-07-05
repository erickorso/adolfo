import { NextResponse } from "next/server";
import { runPublicApiProbes } from "@/services/api-catalog/probe-public-apis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health de APIs públicas e integraciones upstream.
 * GET /api/status/public-apis
 */
export async function GET() {
  const report = await runPublicApiProbes();
  return NextResponse.json(report, {
    status: report.allOk ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
