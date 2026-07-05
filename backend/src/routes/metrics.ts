import { Router } from "express";
import { performance } from "node:perf_hooks";
import { z } from "zod";
import {
  aggregateTopContent,
  countTotalPlays,
} from "../domain/streaming-metrics/aggregate-top-content.js";
import {
  issueMetricsToken,
  METRICS_DEMO_CLIENT_ID,
} from "../lib/metrics-auth.js";
import { loadPlaybackEvents } from "../lib/playback-events.js";
import { requireBearerAuth } from "../middleware/require-bearer-auth.js";
import { requireSandboxEnabled } from "../middleware/require-sandbox-enabled.js";

const tokenBodySchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});

const topContentQuerySchema = z.object({
  from: z.coerce.date({ error: "from must be a valid ISO date" }),
  to: z.coerce.date({ error: "to must be a valid ISO date" }),
  country: z.string().min(2).max(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
});

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
  const parsed = tokenBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const result = issueTokenResponse(parsed.data.clientId, parsed.data.clientSecret);
  res.status(result.status).json(result.body);
});

metricsRouter.get("/get-token", (req, res) => {
  const clientId = req.query.clientId;
  const clientSecret = req.query.clientSecret;

  if (typeof clientId !== "string" || typeof clientSecret !== "string") {
    res.status(400).json({
      error: "Usá clientId y clientSecret",
      hint: "GET ?clientId=metrics-demo&clientSecret=metrics-demo-dev",
    });
    return;
  }

  const result = issueTokenResponse(clientId, clientSecret);
  res.status(result.status).json(result.body);
});

metricsRouter.get("/top-content", requireBearerAuth, (req, res) => {
  const started = performance.now();
  const parsed = topContentQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const query = parsed.data;

  if (query.from > query.to) {
    res.status(400).json({ error: { to: ["must be after from"] } });
    return;
  }

  const events = loadPlaybackEvents();
  const { rows, total } = aggregateTopContent(events, query);
  const totalPlays = countTotalPlays(events, query);

  res.json({
    rows,
    total,
    meta: {
      queryMs: Math.round(performance.now() - started),
      page: query.page,
      pageSize: query.limit,
      totalPlays,
    },
  });
});
