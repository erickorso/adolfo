import type { ApiProbeReport, ApiProbeResult } from "@/domain/api-catalog/types";
import {
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "@/lib/metrics-sandbox-auth.constants";
import { isMetricsSandboxEnabled } from "@/lib/metrics-sandbox-auth";
import { isDemoPublicApiEnabled } from "@/lib/demo/is-demo-api-enabled";
import { getDemoCities } from "@/services/demo/cities.provider";
import { getDemoCountries } from "@/services/demo/countries.provider";
import { getDemoExchangeRates } from "@/services/demo/exchange-rates.provider";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";
import {
  issueMetricsSandboxToken,
  verifyMetricsSandboxToken,
} from "@/lib/metrics-sandbox-auth";

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

function resolveAppOrigin(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function probeInternalRoute(
  id: string,
  path: string,
  validate: (payload: unknown, status: number) => void,
): Promise<ApiProbeResult> {
  return timedProbe(id, async () => {
    const response = await fetch(`${resolveAppOrigin()}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(payload)}`);
    }
    validate(payload, response.status);
    return { message: `HTTP ${response.status}`, statusCode: response.status };
  });
}

/** Probes de upstream y rutas internas públicas. */
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
      const data = await fetchPublicJson<{ items?: unknown[] }>(
        "https://hnrss.org/jobs.jsonfeed",
      );
      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("Empty HN jobs feed");
      }
      return { message: `${data.items.length} items` };
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
        if (!issued) {
          throw new Error("Cannot issue token for probe");
        }
        const response = await fetch(
          `${resolveAppOrigin()}/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=3`,
          {
            headers: { Authorization: `Bearer ${issued.token}` },
            cache: "no-store",
          },
        );
        const payload = (await response.json()) as { rows?: unknown[] };
        if (!response.ok || !Array.isArray(payload.rows)) {
          throw new Error(`HTTP ${response.status}`);
        }
        return { message: `${payload.rows.length} rows`, statusCode: response.status };
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
    await probeInternalRoute("catalog", "/api/catalog?kind=product", (payload) => {
      const page = payload as { items?: unknown[] };
      if (!Array.isArray(page.items)) {
        throw new Error("Invalid catalog page");
      }
    }),
    await probeInternalRoute("auth-session", "/api/auth/session", () => undefined),
    await probeInternalRoute("cart", "/api/cart", (payload) => {
      const cart = payload as { items?: unknown[] };
      if (!Array.isArray(cart.items)) {
        throw new Error("Invalid cart payload");
      }
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
