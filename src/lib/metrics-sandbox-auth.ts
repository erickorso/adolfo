import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import "server-only";
import { env } from "@/lib/env";
import {
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "@/lib/metrics-sandbox-auth.constants";

export {
  METRICS_SANDBOX_DEMO_CLIENT_ID,
  METRICS_SANDBOX_DEMO_CLIENT_SECRET,
} from "@/lib/metrics-sandbox-auth.constants";

const TOKEN_TTL_SEC = 60 * 60;

type MetricsTokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function signingSecret(): string {
  return process.env.METRICS_SANDBOX_SECRET ?? env.AUTH_SECRET;
}

/** Activo por defecto (portfolio demo). Desactivar con METRICS_SANDBOX_ENABLED=false. */
export function isMetricsSandboxEnabled(): boolean {
  return process.env.METRICS_SANDBOX_ENABLED !== "false";
}

export function metricsSandboxDisabledResponse(): NextResponse {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function metricsSandboxUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

function isValidDemoClient(clientId: string, clientSecret: string): boolean {
  const expectedSecret =
    process.env.METRICS_SANDBOX_CLIENT_SECRET ??
    METRICS_SANDBOX_DEMO_CLIENT_SECRET;

  return (
    clientId === METRICS_SANDBOX_DEMO_CLIENT_ID &&
    clientSecret === expectedSecret
  );
}

function signPayload(payload: MetricsTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", signingSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function issueMetricsSandboxToken(
  clientId: string,
  clientSecret: string,
): { token: string; expiresIn: number } | null {
  if (!isValidDemoClient(clientId, clientSecret)) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: MetricsTokenPayload = {
    sub: clientId,
    iat: now,
    exp: now + TOKEN_TTL_SEC,
  };

  return {
    token: signPayload(payload),
    expiresIn: TOKEN_TTL_SEC,
  };
}

export function verifyMetricsSandboxToken(token: string): MetricsTokenPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const expected = createHmac("sha256", signingSecret())
    .update(body)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as MetricsTokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isMetricsSandboxAuthorized(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return false;
  }

  const token = auth.slice("Bearer ".length).trim();
  return verifyMetricsSandboxToken(token) !== null;
}
