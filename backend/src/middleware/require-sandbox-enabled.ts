import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function requireSandboxEnabled(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.metricsSandboxEnabled) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  next();
}
