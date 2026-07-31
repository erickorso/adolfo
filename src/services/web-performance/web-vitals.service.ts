import "server-only";
import { prisma } from "@/lib/prisma";
import {
  isWebVitalName,
  percentile,
  WEB_VITAL_NAMES,
  type WebVitalName,
  type WebVitalRating,
} from "@/domain/web-performance/vitals";

const MAX_PATH = 200;
const ALLOWED_RATINGS = new Set<WebVitalRating>([
  "good",
  "needs-improvement",
  "poor",
]);

export type IngestWebVitalInput = {
  name: string;
  value: number;
  rating: string;
  delta?: number;
  navigationType?: string;
  pathname: string;
  locale?: string;
};

export type MetricAggregate = {
  name: WebVitalName;
  count: number;
  p75: number | null;
  goodPct: number | null;
};

export type WebVitalsSummary = {
  windowHours: number;
  sampleCount: number;
  metrics: MetricAggregate[];
};

export async function ingestWebVital(
  input: IngestWebVitalInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isWebVitalName(input.name)) {
    return { ok: false, error: "name inválido" };
  }
  if (!Number.isFinite(input.value)) {
    return { ok: false, error: "value inválido" };
  }
  if (!ALLOWED_RATINGS.has(input.rating as WebVitalRating)) {
    return { ok: false, error: "rating inválido" };
  }
  const pathname = input.pathname.trim().slice(0, MAX_PATH) || "/";

  await prisma.webVitalSample.create({
    data: {
      name: input.name,
      value: input.value,
      rating: input.rating,
      delta: Number.isFinite(input.delta) ? input.delta : null,
      navigationType: input.navigationType?.slice(0, 40) ?? null,
      pathname,
      locale: input.locale?.slice(0, 8) ?? null,
    },
  });

  return { ok: true };
}

export async function getWebVitalsSummary(
  windowHours = 168,
): Promise<WebVitalsSummary> {
  const since = new Date(Date.now() - windowHours * 3_600_000);
  const rows = await prisma.webVitalSample.findMany({
    where: { createdAt: { gte: since } },
    select: { name: true, value: true, rating: true },
  });

  const metrics: MetricAggregate[] = WEB_VITAL_NAMES.map((name) => {
    const subset = rows.filter((r) => r.name === name);
    const values = subset.map((r) => r.value).sort((a, b) => a - b);
    const good = subset.filter((r) => r.rating === "good").length;
    return {
      name,
      count: subset.length,
      p75: percentile(values, 75),
      goodPct: subset.length ? good / subset.length : null,
    };
  });

  return {
    windowHours,
    sampleCount: rows.length,
    metrics,
  };
}
