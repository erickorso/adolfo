import { NextResponse } from "next/server";
import { z } from "zod";
import playbackEvents from "@/data/streaming/playback-events.json";
import {
  aggregateTopContent,
  countTotalPlays,
} from "@/domain/streaming-metrics/aggregate-top-content";
import type { PlaybackEvent } from "@/domain/streaming-metrics/types";
import {
  isMetricsSandboxAuthorized,
  isMetricsSandboxEnabled,
  metricsSandboxDisabledResponse,
  metricsSandboxUnauthorizedResponse,
} from "@/lib/metrics-sandbox-auth";

export const runtime = "nodejs";

const querySchema = z.object({
  from: z.coerce.date({ error: "from must be a valid ISO date" }),
  to: z.coerce.date({ error: "to must be a valid ISO date" }),
  country: z.string().min(2).max(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
});

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
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = querySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const query = parsed.data;

  if (query.from > query.to) {
    return NextResponse.json({ error: { to: ["must be after from"] } }, { status: 400 });
  }

  const events = playbackEvents as PlaybackEvent[];

  // TODO: descomentar cuando aggregateTopContent esté implementado
  const { rows, total } = aggregateTopContent(events, query);
  const totalPlays = countTotalPlays(events, query);

  return NextResponse.json({
    rows,
    total,
    meta: {
      queryMs: Math.round(performance.now() - started),
      page: query.page,
      pageSize: query.limit,
      totalPlays,
    },
  });
}
