export type WebVitalName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";

export type WebVitalRating = "good" | "needs-improvement" | "poor";

export type WebVitalThresholds = {
  good: number;
  needsImprovement: number;
  /** Unidad para UI. */
  unit: "ms" | "score";
};

/** Umbrales oficiales Google Core Web Vitals / lab companions. */
export const WEB_VITAL_THRESHOLDS: Record<WebVitalName, WebVitalThresholds> = {
  LCP: { good: 2500, needsImprovement: 4000, unit: "ms" },
  INP: { good: 200, needsImprovement: 500, unit: "ms" },
  CLS: { good: 0.1, needsImprovement: 0.25, unit: "score" },
  FCP: { good: 1800, needsImprovement: 3000, unit: "ms" },
  TTFB: { good: 800, needsImprovement: 1800, unit: "ms" },
};

export const WEB_VITAL_NAMES: readonly WebVitalName[] = [
  "LCP",
  "INP",
  "CLS",
  "FCP",
  "TTFB",
] as const;

export function isWebVitalName(value: string): value is WebVitalName {
  return (WEB_VITAL_NAMES as readonly string[]).includes(value);
}

export function formatWebVitalValue(
  name: WebVitalName,
  value: number,
): string {
  const { unit } = WEB_VITAL_THRESHOLDS[name];
  if (unit === "score") {
    return value.toFixed(3);
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} s`;
  }
  return `${Math.round(value)} ms`;
}

/** Percentil lineal (p en 0–100). */
export function percentile(sortedAsc: number[], p: number): number | null {
  if (sortedAsc.length === 0) {
    return null;
  }
  if (sortedAsc.length === 1) {
    return sortedAsc[0]!;
  }
  const rank = (p / 100) * (sortedAsc.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) {
    return sortedAsc[low]!;
  }
  const weight = rank - low;
  return sortedAsc[low]! * (1 - weight) + sortedAsc[high]! * weight;
}
