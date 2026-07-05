import { Router } from "express";
import { performance } from "node:perf_hooks";
import { composeTopContentResponse } from "../domain/streaming-metrics/aggregate-top-content.js";
import {
  parseGetTokenBody,
  parseTopContentQuery,
} from "../domain/streaming-metrics/schemas.js";
import {
  issueMetricsToken,
  METRICS_DEMO_CLIENT_ID,
} from "../lib/metrics-auth.js";
import { loadPlaybackEvents } from "../lib/playback-events.js";
import { requireBearerAuth } from "../middleware/require-bearer-auth.js";
import { requireSandboxEnabled } from "../middleware/require-sandbox-enabled.js";

function issueTokenResponse(clientId: string, clientSecret: string) {
  const issued = issueMetricsToken(clientId, clientSecret);
  if (!issued) {
    return { status: 401 as const, body: { error: "Credenciales inválidas" } };
  }

  return {
    status: 200 as const,
    body: {
      token: issued.token,
      tokenType: "Bearer" as const,
      expiresIn: issued.expiresIn,
      clientId: METRICS_DEMO_CLIENT_ID,
    },
  };
}

export const metricsRouter = Router();

metricsRouter.use(requireSandboxEnabled);

metricsRouter.post("/get-token", (req, res) => {
  const parsed = parseGetTokenBody(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const result = issueTokenResponse(parsed.data.clientId, parsed.data.clientSecret);
  res.status(result.status).json(result.body);
});

metricsRouter.get("/get-token", (req, res) => {
  const parsed = parseGetTokenBody({
    clientId: typeof req.query.clientId === "string" ? req.query.clientId : "",
    clientSecret:
      typeof req.query.clientSecret === "string" ? req.query.clientSecret : "",
  });

  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error,
      hint: "GET ?clientId=metrics-demo&clientSecret=metrics-demo-dev",
    });
    return;
  }

  const result = issueTokenResponse(parsed.data.clientId, parsed.data.clientSecret);
  res.status(result.status).json(result.body);
});

metricsRouter.get("/top-content", requireBearerAuth, (req, res) => {
  const started = performance.now();
  const parsed = parseTopContentQuery(
    Object.fromEntries(
      Object.entries(req.query).map(([key, value]) => [
        key,
        typeof value === "string" ? value : undefined,
      ]),
    ),
  );

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const events = loadPlaybackEvents();
  const body = composeTopContentResponse(
    events,
    parsed.data,
    Math.round(performance.now() - started),
  );

  res.json(body);
});
