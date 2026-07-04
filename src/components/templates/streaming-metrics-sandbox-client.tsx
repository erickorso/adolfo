"use client";

import { useCallback, useState } from "react";
import {
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "@/lib/metrics-sandbox-auth.constants";

const TOKEN_STORAGE_KEY = "metrics-sandbox-token";

function readStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

type TopContentResponse = {
  rows: Array<{ contentId: string; plays: number; totalDurationSec: number }>;
  total: number;
  meta: { queryMs: number; page: number; pageSize: number; totalPlays: number };
};

/**
 * SIMULACRO A — UI
 * Auth de prueba: get-token → Bearer en top-content
 * TODO: tabla completa + paginación cuando aggregate esté implementado
 */
export function StreamingMetricsSandboxClient() {
  const [clientId, setClientId] = useState(METRICS_SANDBOX_DEMO_CLIENT_ID);
  const [clientSecret, setClientSecret] = useState(METRICS_SANDBOX_DEMO_CLIENT_SECRET);
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [data, setData] = useState<TopContentResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const login = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/metrics/get-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      const json = (await response.json()) as { token?: string; error?: string };

      if (!response.ok) {
        setAuthError(json.error ?? "Login falló");
        setToken(null);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        return;
      }

      setToken(json.token ?? null);
      if (json.token) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, json.token);
      }
    } catch {
      setAuthError("Error de red al obtener token");
    } finally {
      setAuthLoading(false);
    }
  }, [clientId, clientSecret]);

  const fetchMetrics = useCallback(async () => {
    if (!token) {
      setFetchError("Obtené un token primero");
      return;
    }

    setFetchLoading(true);
    setFetchError(null);

    try {
      const params = new URLSearchParams({
        from: "2026-06-01",
        to: "2026-06-30",
        limit: "5",
        country: "ES",
      });

      const response = await fetch(`/api/metrics/top-content?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = (await response.json()) as TopContentResponse & { error?: string };

      if (!response.ok) {
        setFetchError(json.error ?? `HTTP ${response.status}`);
        setData(null);
        return;
      }

      setData(json);
    } catch {
      setFetchError("Error de red al consultar métricas");
    } finally {
      setFetchLoading(false);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setData(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <div className="flex flex-col gap-6">
      <section
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
        aria-labelledby="metrics-auth-title"
      >
        <h2 id="metrics-auth-title" className="text-lg font-semibold">
          1. Get token (prueba)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">clientId</span>
            <input
              className="rounded-md border border-input bg-background px-3 py-2"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">clientSecret</span>
            <input
              className="rounded-md border border-input bg-background px-3 py-2"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              autoComplete="off"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={login}
            disabled={authLoading}
          >
            {authLoading ? "Obteniendo…" : "POST /api/metrics/get-token"}
          </button>
          {token ? (
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm"
              onClick={logout}
            >
              Logout
            </button>
          ) : null}
        </div>
        {authError ? (
          <p className="text-sm text-destructive" role="alert">
            {authError}
          </p>
        ) : null}
        {token ? (
          <p className="break-all font-mono text-xs text-muted-foreground">
            Bearer {token.slice(0, 48)}…
          </p>
        ) : null}
      </section>

      <section
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
        aria-labelledby="metrics-fetch-title"
      >
        <h2 id="metrics-fetch-title" className="text-lg font-semibold">
          2. Consultar métricas
        </h2>
        <button
          type="button"
          className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          onClick={fetchMetrics}
          disabled={fetchLoading || !token}
        >
          {fetchLoading ? "Cargando…" : "GET /api/metrics/top-content"}
        </button>
        {fetchError ? (
          <p className="text-sm text-destructive" role="alert">
            {fetchError}
          </p>
        ) : null}
        {data ? (
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : null}
      </section>
    </div>
  );
}
