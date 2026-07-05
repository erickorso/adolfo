import { z } from "zod";

const DEFAULT_DEV_SECRET = "dev-metrics-secret-minimum-32-chars";

const envSchema = z.object({
  port: z.coerce.number().int().positive().default(4000),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  /** Activo por defecto; desactivar con METRICS_SANDBOX_ENABLED=false */
  metricsSandboxEnabled: z.boolean(),
  metricsSandboxSecret: z.string().min(16),
  metricsClientSecret: z.string().min(1),
});

function loadEnv(): z.infer<typeof envSchema> {
  const parsed = envSchema.safeParse({
    port: process.env.METRICS_API_PORT ?? process.env.PORT ?? "4000",
    nodeEnv: process.env.NODE_ENV ?? "development",
    metricsSandboxEnabled: process.env.METRICS_SANDBOX_ENABLED !== "false",
    metricsSandboxSecret:
      process.env.METRICS_SANDBOX_SECRET ??
      process.env.AUTH_SECRET ??
      DEFAULT_DEV_SECRET,
    metricsClientSecret:
      process.env.METRICS_SANDBOX_CLIENT_SECRET ?? "metrics-demo-dev",
  });

  if (!parsed.success) {
    console.error("Backend env inválido:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  if (
    parsed.data.nodeEnv === "production" &&
    parsed.data.metricsSandboxSecret === DEFAULT_DEV_SECRET
  ) {
    console.error(
      "Backend: definí METRICS_SANDBOX_SECRET o AUTH_SECRET en production",
    );
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
