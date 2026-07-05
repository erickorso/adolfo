import { NextResponse } from "next/server";
import playbackEvents from "@/data/streaming/playback-events.json";
import { composeTopContentResponse } from "@/domain/streaming-metrics/aggregate-top-content";
import { parseTopContentQuery } from "@/domain/streaming-metrics/schemas";
import type { PlaybackEvent } from "@/domain/streaming-metrics/types";
import {
  isMetricsSandboxAuthorized,
  isMetricsSandboxEnabled,
  metricsSandboxDisabledResponse,
  metricsSandboxUnauthorizedResponse,
} from "@/lib/metrics-sandbox-auth";

export const runtime = "nodejs";

/**
 * GET /api/metrics/top-content?from=&to=&country=&limit=&page=
 * Requiere Authorization: Bearer <token> (obtener en /api/metrics/get-token).
 */
export async function GET(request: Request) {
  if (!isMetricsSandboxEnabled()) {
    return metricsSandboxDisabledResponse();
  }

  if (!isMetricsSandboxAuthorized(request)) {
    return metricsSandboxUnauthorizedResponse();
  }

  const started = performance.now();
  const url = new URL(request.url);
  const parsed = parseTopContentQuery(
    Object.fromEntries(url.searchParams.entries()),
  );

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const events = playbackEvents as PlaybackEvent[];
  const body = composeTopContentResponse(
    events,
    parsed.data,
    Math.round(performance.now() - started),
  );

  return NextResponse.json(body);
}
