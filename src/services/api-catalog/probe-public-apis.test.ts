import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/demo/is-demo-api-enabled", () => ({
  isDemoPublicApiEnabled: vi.fn(() => true),
}));

vi.mock("@/lib/metrics-sandbox-auth", () => ({
  isMetricsSandboxEnabled: vi.fn(() => true),
  issueMetricsSandboxToken: vi.fn(() => ({
    token: "mock.token.sig",
    expiresIn: 3600,
  })),
  verifyMetricsSandboxToken: vi.fn(() => ({ sub: "metrics-demo", iat: 0, exp: 9999999999 })),
}));

vi.mock("@/services/demo/exchange-rates.provider", () => ({
  getDemoExchangeRates: vi.fn(),
}));

vi.mock("@/services/demo/countries.provider", () => ({
  getDemoCountries: vi.fn(),
}));

vi.mock("@/services/demo/cities.provider", () => ({
  getDemoCities: vi.fn(),
}));

vi.mock("@/services/demo/public-api-fetch", () => ({
  fetchPublicJson: vi.fn(),
}));

import { isDemoPublicApiEnabled } from "@/lib/demo/is-demo-api-enabled";
import { isMetricsSandboxEnabled } from "@/lib/metrics-sandbox-auth";
import { getDemoCities } from "@/services/demo/cities.provider";
import { getDemoCountries } from "@/services/demo/countries.provider";
import { getDemoExchangeRates } from "@/services/demo/exchange-rates.provider";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";
import { runPublicApiProbes } from "@/services/api-catalog/probe-public-apis";
import { API_CATALOG_ENTRIES } from "@/domain/api-catalog/entries";

describe("runPublicApiProbes", () => {
  beforeEach(() => {
    vi.mocked(isDemoPublicApiEnabled).mockReturnValue(true);
    vi.mocked(isMetricsSandboxEnabled).mockReturnValue(true);

    vi.mocked(getDemoExchangeRates).mockResolvedValue({
      base: "USD",
      date: "2026-07-01",
      rates: { EUR: 0.92, ARS: 1200 },
      meta: { source: "open.er-api.com", cached: false, updatedAt: "2026-07-01T00:00:00.000Z" },
    });

    vi.mocked(getDemoCountries).mockResolvedValue({
      countries: [{ name: "Spain", iso2: "ES", iso3: "ESP" }],
      total: 1,
      meta: { source: "countriesnow.space", cached: false },
    });

    vi.mocked(getDemoCities).mockResolvedValue({
      country: "Spain",
      cities: ["Madrid", "Barcelona"],
      total: 2,
      meta: { source: "countriesnow.space", cached: false, limit: 5 },
    });

    vi.mocked(fetchPublicJson).mockImplementation(async (url: string) => {
      if (url.includes("dolarapi")) {
        return [{ casa: "tarjeta", venta: 1200 }];
      }
      if (url.includes("remotive")) {
        return { jobs: [{ id: 1 }] };
      }
      if (url.includes("hnrss")) {
        return { items: [{ title: "job" }] };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/catalog")) {
          return new Response(JSON.stringify({ items: [{ id: "p1" }], nextCursor: null }), {
            status: 200,
          });
        }
        if (url.includes("/api/auth/session")) {
          return new Response(JSON.stringify(null), { status: 200 });
        }
        if (url.includes("/api/cart")) {
          return new Response(JSON.stringify({ items: [] }), { status: 200 });
        }
        if (url.includes("/api/metrics/top-content")) {
          return new Response(JSON.stringify({ rows: [{ id: "a", plays: 1 }] }), {
            status: 200,
          });
        }
        return new Response("not found", { status: 404 });
      }),
    );
  });

  it("marca allOk cuando todas las probes pasan", async () => {
    const report = await runPublicApiProbes();

    expect(report.allOk).toBe(true);
    expect(report.failedCount).toBe(0);
    expect(report.probes.every((probe) => probe.ok)).toBe(true);
  });

  it("cubre todos los ids del catálogo", async () => {
    const report = await runPublicApiProbes();
    const catalogIds = new Set(API_CATALOG_ENTRIES.map((entry) => entry.id));
    const probeIds = new Set(report.probes.map((probe) => probe.id));

    for (const id of catalogIds) {
      expect(probeIds.has(id)).toBe(true);
    }
  });

  it("reporta fallo si demo APIs están deshabilitadas", async () => {
    vi.mocked(isDemoPublicApiEnabled).mockReturnValue(false);

    const report = await runPublicApiProbes();
    const demo = report.probes.filter((probe) => probe.id.startsWith("demo-"));

    expect(demo.every((probe) => !probe.ok)).toBe(true);
    expect(report.allOk).toBe(false);
  });

  it("reporta fallo si upstream de exchange rates falla", async () => {
    vi.mocked(getDemoExchangeRates).mockRejectedValue(new Error("upstream down"));

    const report = await runPublicApiProbes();
    const exchange = report.probes.find((probe) => probe.id === "demo-exchange-rates");

    expect(exchange?.ok).toBe(false);
    expect(exchange?.message).toContain("upstream down");
  });
});

describe("API_CATALOG_ENTRIES", () => {
  it("tiene ids únicos", () => {
    const ids = API_CATALOG_ENTRIES.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
