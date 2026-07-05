import playbackEvents from "@/data/streaming/playback-events.json";
import type { ApiProbeReport, ApiProbeResult } from "@/domain/api-catalog/types";
import { composeTopContentResponse } from "@/domain/streaming-metrics/aggregate-top-content";
import { parseTopContentQuery } from "@/domain/streaming-metrics/schemas";
import type { PlaybackEvent } from "@/domain/streaming-metrics/types";
import {
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "@/lib/metrics-sandbox-auth.constants";
import {
  isMetricsSandboxEnabled,
  issueMetricsSandboxToken,
  verifyMetricsSandboxToken,
} from "@/lib/metrics-sandbox-auth";
import { isDemoPublicApiEnabled } from "@/lib/demo/is-demo-api-enabled";
import { auth } from "@/lib/auth";
import { getCartFromCookie } from "@/lib/cart-cookie";
import { getDemoCities } from "@/services/demo/cities.provider";
import { getDemoCountries } from "@/services/demo/countries.provider";
import { getDemoExchangeRates } from "@/services/demo/exchange-rates.provider";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";
import { listCatalogPage } from "@/services/catalog/catalog.service";
import { probeHackerNewsJobsAvailability } from "@/services/jobs/hn-jobs-health";

async function timedProbe(
  id: string,
  run: () => Promise<{ message: string; statusCode?: number }>,
): Promise<ApiProbeResult> {
  const started = performance.now();
  try {
    const { message, statusCode } = await run();
    return {
      id,
      ok: true,
      latencyMs: Math.round(performance.now() - started),
      message,
      statusCode,
    };
  } catch (error) {
    return {
      id,
      ok: false,
      latencyMs: Math.round(performance.now() - started),
      message: error instanceof Error ? error.message : "Probe failed",
    };
  }
}

/** Probes de upstream y rutas internas (sin HTTP loopback — fiable en Vercel SSR). */
export async function runPublicApiProbes(): Promise<ApiProbeReport> {
  const probes: ApiProbeResult[] = [];

  if (isDemoPublicApiEnabled()) {
    probes.push(
      await timedProbe("demo-exchange-rates", async () => {
        const data = await getDemoExchangeRates("USD");
        if (!data.rates.EUR) {
          throw new Error("Missing EUR rate in response");
        }
        return { message: `base ${data.base}, ${Object.keys(data.rates).length} rates` };
      }),
      await timedProbe("demo-countries", async () => {
        const data = await getDemoCountries({ code: "ES", limit: 5 });
        if (data.countries.length !== 1 || data.countries[0]?.iso2 !== "ES") {
          throw new Error("Spain (ES) not found");
        }
        return { message: `${data.total} match, source ${data.meta.source}` };
      }),
      await timedProbe("demo-cities", async () => {
        const data = await getDemoCities("Spain", 5);
        if (data.cities.length === 0) {
          throw new Error("No cities returned");
        }
        return { message: `${data.cities.length}/${data.total} cities` };
      }),
    );
  } else {
    for (const id of ["demo-exchange-rates", "demo-countries", "demo-cities"]) {
      probes.push({
        id,
        ok: false,
        latencyMs: 0,
        message: "DEMO_PUBLIC_APIS_ENABLED=false",
      });
    }
  }

  probes.push(
    await timedProbe("dolarapi", async () => {
      const data = await fetchPublicJson<Array<{ casa: string; venta: number | null }>>(
        "https://dolarapi.com/v1/dolares",
      );
      const tarjeta = data.find((row) => row.casa === "tarjeta");
      if (!tarjeta?.venta) {
        throw new Error("tarjeta rate missing");
      }
      return { message: `tarjeta venta ${tarjeta.venta}` };
    }),
    await timedProbe("remotive-jobs", async () => {
      const data = await fetchPublicJson<{ jobs?: unknown[] }>(
        "https://remotive.com/api/remote-jobs",
      );
      if (!Array.isArray(data.jobs) || data.jobs.length === 0) {
        throw new Error("Empty jobs array");
      }
      return { message: `${data.jobs.length} jobs` };
    }),
    await timedProbe("hackernews-jobs", async () => {
      const data = await probeHackerNewsJobsAvailability();
      return { message: `${data.count} items (${data.source})` };
    }),
  );

  if (isMetricsSandboxEnabled()) {
    probes.push(
      await timedProbe("metrics-get-token", async () => {
        const issued = issueMetricsSandboxToken(
          METRICS_SANDBOX_DEMO_CLIENT_ID,
          METRICS_SANDBOX_DEMO_CLIENT_SECRET,
        );
        if (!issued?.token) {
          throw new Error("Token not issued");
        }
        if (!verifyMetricsSandboxToken(issued.token)) {
          throw new Error("Token verification failed");
        }
        return { message: `token ${issued.token.slice(0, 12)}…` };
      }),
      await timedProbe("metrics-top-content", async () => {
        const issued = issueMetricsSandboxToken(
          METRICS_SANDBOX_DEMO_CLIENT_ID,
          METRICS_SANDBOX_DEMO_CLIENT_SECRET,
        );
        if (!issued || !verifyMetricsSandboxToken(issued.token)) {
          throw new Error("Cannot issue valid token for probe");
        }

        const parsed = parseTopContentQuery({
          from: "2026-06-01",
          to: "2026-06-30",
          limit: "3",
        });
        if (!parsed.success) {
          throw new Error("Invalid probe query");
        }

        const body = composeTopContentResponse(
          playbackEvents as PlaybackEvent[],
          parsed.data,
          0,
        );
        if (!Array.isArray(body.rows)) {
          throw new Error("Invalid top-content response");
        }

        return { message: `${body.rows.length} rows, ${body.meta.totalPlays} plays` };
      }),
    );
  } else {
    for (const id of ["metrics-get-token", "metrics-top-content"]) {
      probes.push({
        id,
        ok: false,
        latencyMs: 0,
        message: "METRICS_SANDBOX_ENABLED=false",
      });
    }
  }

  probes.push(
    await timedProbe("catalog", async () => {
      const page = await listCatalogPage("product", {});
      if (!Array.isArray(page.items)) {
        throw new Error("Invalid catalog page");
      }
      return { message: `${page.items.length} items` };
    }),
    await timedProbe("auth-session", async () => {
      const session = await auth();
      return {
        message: session?.user?.email
          ? `session: ${session.user.email}`
          : "guest (no session)",
        statusCode: 200,
      };
    }),
    await timedProbe("cart", async () => {
      const items = await getCartFromCookie();
      if (!Array.isArray(items)) {
        throw new Error("Invalid cart payload");
      }
      return { message: `${items.length} items in cookie` };
    }),
  );

  const failedCount = probes.filter((probe) => !probe.ok).length;

  return {
    checkedAt: new Date().toISOString(),
    probes,
    allOk: failedCount === 0,
    failedCount,
  };
}
