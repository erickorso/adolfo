const DEFAULT_DEV_SECRET = "dev-metrics-secret-minimum-32-chars";

export const env = {
  port: Number(process.env.METRICS_API_PORT ?? process.env.PORT ?? 4000),
  metricsSandboxEnabled: process.env.METRICS_SANDBOX_ENABLED !== "false",
  metricsSandboxSecret:
    process.env.METRICS_SANDBOX_SECRET ??
    process.env.AUTH_SECRET ??
    DEFAULT_DEV_SECRET,
  metricsClientSecret:
    process.env.METRICS_SANDBOX_CLIENT_SECRET ?? "metrics-demo-dev",
};
