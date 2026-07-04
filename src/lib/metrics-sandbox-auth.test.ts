import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    AUTH_SECRET: "test-auth-secret-min-32-chars-long",
    METRICS_SANDBOX_SECRET: undefined,
    METRICS_SANDBOX_CLIENT_SECRET: undefined,
  },
}));

import {
  issueMetricsSandboxToken,
  verifyMetricsSandboxToken,
  isMetricsSandboxAuthorized,
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "./metrics-sandbox-auth";

describe("metrics-sandbox-auth", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
  });

  it("emite y valida token Bearer", () => {
    const issued = issueMetricsSandboxToken(
      METRICS_SANDBOX_DEMO_CLIENT_ID,
      METRICS_SANDBOX_DEMO_CLIENT_SECRET,
    );

    expect(issued?.token).toBeTruthy();
    expect(verifyMetricsSandboxToken(issued!.token)?.sub).toBe("metrics-demo");
  });

  it("rechaza credenciales inválidas", () => {
    expect(issueMetricsSandboxToken("wrong", "wrong")).toBeNull();
  });

  it("isMetricsSandboxAuthorized acepta Bearer válido", () => {
    const issued = issueMetricsSandboxToken(
      METRICS_SANDBOX_DEMO_CLIENT_ID,
      METRICS_SANDBOX_DEMO_CLIENT_SECRET,
    )!;

    const request = new Request("http://localhost/api/metrics/top-content", {
      headers: { authorization: `Bearer ${issued.token}` },
    });

    expect(isMetricsSandboxAuthorized(request)).toBe(true);
  });

  it("rechaza Bearer inválido", () => {
    const request = new Request("http://localhost/api/metrics/top-content", {
      headers: { authorization: "Bearer invalid.token" },
    });

    expect(isMetricsSandboxAuthorized(request)).toBe(false);
  });
});
