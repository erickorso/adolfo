import express from "express";
import { metricsRouter } from "./routes/metrics.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "adolfo-metrics-api" });
  });

  app.use("/api/metrics", metricsRouter);

  return app;
}
