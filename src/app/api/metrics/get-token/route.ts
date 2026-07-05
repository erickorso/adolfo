import { NextResponse } from "next/server";
import { parseGetTokenBody } from "@/domain/streaming-metrics/schemas";
import {
  isMetricsSandboxEnabled,
  issueMetricsSandboxToken,
  metricsSandboxDisabledResponse,
  METRICS_SANDBOX_DEMO_CLIENT_ID,
} from "@/lib/metrics-sandbox-auth";

export const runtime = "nodejs";

/**
 * Emite Bearer token para el simulacro de métricas.
 * POST /api/metrics/get-token  { clientId, clientSecret }
 * GET  /api/metrics/get-token?clientId=&clientSecret=  (solo prueba rápida)
 */
async function issueToken(clientId: string, clientSecret: string) {
  const issued = issueMetricsSandboxToken(clientId, clientSecret);
  if (!issued) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  return NextResponse.json({
    token: issued.token,
    tokenType: "Bearer",
    expiresIn: issued.expiresIn,
    clientId: METRICS_SANDBOX_DEMO_CLIENT_ID,
  });
}

export async function POST(request: Request) {
  if (!isMetricsSandboxEnabled()) {
    return metricsSandboxDisabledResponse();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = parseGetTokenBody(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  return issueToken(parsed.data.clientId, parsed.data.clientSecret);
}

export async function GET(request: Request) {
  if (!isMetricsSandboxEnabled()) {
    return metricsSandboxDisabledResponse();
  }

  const url = new URL(request.url);
  const parsed = parseGetTokenBody({
    clientId: url.searchParams.get("clientId") ?? "",
    clientSecret: url.searchParams.get("clientSecret") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error,
        hint: "GET ?clientId=metrics-demo&clientSecret=metrics-demo-dev",
      },
      { status: 400 },
    );
  }

  return issueToken(parsed.data.clientId, parsed.data.clientSecret);
}
