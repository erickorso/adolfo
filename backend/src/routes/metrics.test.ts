import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.stubEnv("METRICS_SANDBOX_ENABLED", "true");
vi.stubEnv("METRICS_SANDBOX_SECRET", "test-metrics-secret-min-32-chars");
vi.stubEnv("AUTH_SECRET", "test-metrics-secret-min-32-chars");

const { createApp } = await import("../app.js");

describe("Express metrics routes", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => resolve());
    });
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Cannot bind test server");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("GET /api/metrics/get-token emite Bearer", async () => {
    const response = await fetch(
      `${baseUrl}/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev`,
    );
    const body = (await response.json()) as { token?: string };

    expect(response.status).toBe(200);
    expect(body.token).toBeTruthy();
  });

  it("GET /api/metrics/top-content requiere Bearer", async () => {
    const response = await fetch(
      `${baseUrl}/api/metrics/top-content?from=2026-06-01&to=2026-06-30`,
    );

    expect(response.status).toBe(401);
  });

  it("GET /api/metrics/top-content con token válido responde rows", async () => {
    const tokenRes = await fetch(
      `${baseUrl}/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev`,
    );
    const tokenBody = (await tokenRes.json()) as { token: string };

    const response = await fetch(
      `${baseUrl}/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=3`,
      { headers: { Authorization: `Bearer ${tokenBody.token}` } },
    );
    const body = (await response.json()) as { rows?: unknown[]; meta?: { totalPlays: number } };

    expect(response.status).toBe(200);
    expect(Array.isArray(body.rows)).toBe(true);
    expect(body.meta?.totalPlays).toBeGreaterThan(0);
  });

  it("GET /api/metrics/top-content rechaza from > to", async () => {
    const tokenRes = await fetch(
      `${baseUrl}/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev`,
    );
    const tokenBody = (await tokenRes.json()) as { token: string };

    const response = await fetch(
      `${baseUrl}/api/metrics/top-content?from=2026-07-10&to=2026-07-01`,
      { headers: { Authorization: `Bearer ${tokenBody.token}` } },
    );

    expect(response.status).toBe(400);
  });

  it("GET /api/metrics/top-content rechaza Bearer inválido", async () => {
    const response = await fetch(
      `${baseUrl}/api/metrics/top-content?from=2026-06-01&to=2026-06-30`,
      { headers: { Authorization: "Bearer invalid.token.here" } },
    );

    expect(response.status).toBe(401);
  });
});

describe("Express sandbox flag", () => {
  it("404 cuando METRICS_SANDBOX_ENABLED=false", async () => {
    vi.stubEnv("METRICS_SANDBOX_ENABLED", "false");
    vi.resetModules();

    const { createApp: createDisabledApp } = await import("../app.js");
    const app = createDisabledApp();

    const disabledServer = await new Promise<Server>((resolve, reject) => {
      const server = app.listen(0, "127.0.0.1", (error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(server);
      });
    });

    const address = disabledServer.address();
    if (!address || typeof address === "string") {
      throw new Error("Cannot bind test server");
    }

    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev`,
    );

    expect(response.status).toBe(404);

    await new Promise<void>((resolve, reject) => {
      disabledServer.close((error) => (error ? reject(error) : resolve()));
    });

    vi.stubEnv("METRICS_SANDBOX_ENABLED", "true");
  });
});
