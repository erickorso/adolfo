import type { ApiCatalogEntry } from "./types";

/** Catálogo documentado — mantener en sync con Postman y probes. */
export const API_CATALOG_ENTRIES: ApiCatalogEntry[] = [
  {
    id: "demo-exchange-rates",
    kind: "external",
    name: "Exchange rates (demo)",
    description: {
      es: "Tipos de cambio vía open.er-api.com, expuesto en nuestra API.",
      en: "Exchange rates via open.er-api.com, exposed through our API.",
    },
    path: "/api/demo/exchange-rates?base=USD",
    method: "GET",
    upstreamUrl: "https://open.er-api.com/v6/latest/USD",
    postmanFolder: "Demo (Public APIs)",
  },
  {
    id: "demo-countries",
    kind: "external",
    name: "Countries (demo)",
    description: {
      es: "Listado y búsqueda de países (countriesnow.space).",
      en: "Country list and search (countriesnow.space).",
    },
    path: "/api/demo/countries?code=ES",
    method: "GET",
    upstreamUrl: "https://countriesnow.space/api/v0.1/countries",
    postmanFolder: "Demo (Public APIs)",
  },
  {
    id: "demo-cities",
    kind: "external",
    name: "Cities (demo)",
    description: {
      es: "Ciudades por país en inglés (countriesnow.space).",
      en: "Cities by country name in English (countriesnow.space).",
    },
    path: "/api/demo/cities?country=Spain&limit=5",
    method: "GET",
    upstreamUrl: "https://countriesnow.space/api/v0.1/countries/cities",
    postmanFolder: "Demo (Public APIs)",
  },
  {
    id: "dolarapi",
    kind: "external",
    name: "DolarAPI (ARS rates)",
    description: {
      es: "Cotización USD/ARS para el catálogo (ingesta interna, no expuesta como REST público).",
      en: "USD/ARS rates for the catalog (internal ingest, not a public REST route).",
    },
    upstreamUrl: "https://dolarapi.com/v1/dolares",
  },
  {
    id: "remotive-jobs",
    kind: "external",
    name: "Remotive jobs",
    description: {
      es: "Fuente de empleos remotos para /es/jobs (ingesta semanal).",
      en: "Remote jobs source for /es/jobs (weekly ingest).",
    },
    upstreamUrl: "https://remotive.com/api/remote-jobs",
  },
  {
    id: "hackernews-jobs",
    kind: "external",
    name: "Hacker News Jobs",
    description: {
      es: "Feed JSON de vacantes YC (hnrss.org).",
      en: "YC jobs JSON feed (hnrss.org).",
    },
    upstreamUrl: "https://hnrss.org/jobs.jsonfeed",
  },
  {
    id: "metrics-get-token",
    kind: "internal",
    name: "Metrics — get token",
    description: {
      es: "OAuth-like demo: clientId/secret → Bearer (simulacro Mediastream).",
      en: "OAuth-like demo: clientId/secret → Bearer (Mediastream simulacro).",
    },
    path: "/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev",
    method: "GET",
    postmanFolder: "Metrics (Sandbox)",
    sandboxPath: "/sandbox/streaming-metrics",
  },
  {
    id: "metrics-top-content",
    kind: "internal",
    name: "Metrics — top content",
    description: {
      es: "Ranking de plays con Bearer token.",
      en: "Play ranking with Bearer token.",
    },
    path: "/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=3",
    method: "GET",
    postmanFolder: "Metrics (Sandbox)",
    sandboxPath: "/sandbox/streaming-metrics",
  },
  {
    id: "catalog",
    kind: "internal",
    name: "Catalog",
    description: {
      es: "Productos y servicios paginados (scroll infinito).",
      en: "Paginated products and services (infinite scroll).",
    },
    path: "/api/catalog?kind=product",
    method: "GET",
    postmanFolder: "Catalog",
  },
  {
    id: "auth-session",
    kind: "internal",
    name: "Auth session",
    description: {
      es: "Sesión Auth.js (JSON).",
      en: "Auth.js session (JSON).",
    },
    path: "/api/auth/session",
    method: "GET",
    postmanFolder: "Auth",
  },
  {
    id: "cart",
    kind: "internal",
    name: "Cart",
    description: {
      es: "Carrito en cookie (JSON).",
      en: "Cart from cookie (JSON).",
    },
    path: "/api/cart",
    method: "GET",
    postmanFolder: "Cart (JSON)",
  },
];

export function getCatalogEntry(id: string): ApiCatalogEntry | undefined {
  return API_CATALOG_ENTRIES.find((entry) => entry.id === id);
}
