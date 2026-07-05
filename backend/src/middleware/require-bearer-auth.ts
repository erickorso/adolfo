import type { NextFunction, Request, Response } from "express";
import { extractBearerToken, verifyMetricsToken } from "../lib/metrics-auth.js";

export function requireBearerAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.get("authorization"));
  if (!token || !verifyMetricsToken(token)) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}
