"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

function sendMetric(metric: Metric, locale: string) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
    pathname: window.location.pathname,
    locale,
  });

  void fetch("/api/web-vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

/**
 * Reporter RUM global: envía LCP/INP/CLS/FCP/TTFB a Neon (sin PII).
 */
export function WebVitalsReporter() {
  const locale = useLocale();

  useEffect(() => {
    const report = (metric: Metric) => sendMetric(metric, locale);
    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  }, [locale]);

  return null;
}
