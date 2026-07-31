"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import {
  WEB_VITAL_NAMES,
  formatWebVitalValue,
  type WebVitalName,
  type WebVitalRating,
} from "@/domain/web-performance/vitals";

type LiveEntry = {
  value: number;
  rating: WebVitalRating;
};

type FieldMetric = {
  name: WebVitalName;
  count: number;
  p75: number | null;
  goodPct: number | null;
};

type FieldSummary = {
  windowHours: number;
  sampleCount: number;
  metrics: FieldMetric[];
};

function ratingClass(rating: WebVitalRating | null): string {
  if (rating === "good") return "text-emerald-700 dark:text-emerald-300";
  if (rating === "needs-improvement")
    return "text-amber-700 dark:text-amber-300";
  if (rating === "poor") return "text-red-700 dark:text-red-300";
  return "text-muted-foreground";
}

/**
 * Dashboard: métricas de esta sesión + P75 field de Adolfo (Neon).
 */
export function WebPerformanceDashboard() {
  const t = useTranslations("webPerformance");
  const [live, setLive] = useState<Partial<Record<WebVitalName, LiveEntry>>>(
    {},
  );
  const [field, setField] = useState<FieldSummary | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    const push = (metric: Metric) => {
      setLive((prev) => ({
        ...prev,
        [metric.name as WebVitalName]: {
          value: metric.value,
          rating: metric.rating,
        },
      }));
    };
    onCLS(push);
    onINP(push);
    onLCP(push);
    onFCP(push);
    onTTFB(push);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/web-vitals?hours=168")
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as FieldSummary;
      })
      .then((data) => {
        if (!cancelled) setField(data);
      })
      .catch(() => {
        if (!cancelled) setFieldError(t("fieldError"));
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="live-vitals-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <h2 id="live-vitals-heading" className="text-lg font-semibold">
          {t("liveTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("liveHint")}</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {WEB_VITAL_NAMES.map((name) => {
            const entry = live[name];
            return (
              <li
                key={name}
                className="rounded-md border border-border px-3 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {name}
                </p>
                <p
                  className={`mt-1 text-xl font-semibold tabular-nums ${ratingClass(entry?.rating ?? null)}`}
                >
                  {entry
                    ? formatWebVitalValue(name, entry.value)
                    : t("pending")}
                </p>
                {entry ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(`rating.${entry.rating}`)}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="field-vitals-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <h2 id="field-vitals-heading" className="text-lg font-semibold">
          {t("fieldTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("fieldHint")}</p>
        {fieldError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {fieldError}
          </p>
        ) : null}
        {field ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("fieldMeta", {
                hours: field.windowHours,
                count: field.sampleCount,
              })}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {field.metrics.map((m) => (
                <li
                  key={m.name}
                  className="rounded-md border border-border px-3 py-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {m.name} · P75
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {m.p75 != null
                      ? formatWebVitalValue(m.name, m.p75)
                      : t("noData")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("fieldSamples", { count: m.count })}
                    {m.goodPct != null
                      ? ` · ${t("goodPct", { pct: Math.round(m.goodPct * 100) })}`
                      : null}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : !fieldError ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("loadingField")}</p>
        ) : null}
      </section>
    </div>
  );
}
