import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

export const METRICS_DEMO_CLIENT_ID = "metrics-demo";

const TOKEN_TTL_SEC = 60 * 60;

type MetricsTokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function isValidDemoClient(clientId: string, clientSecret: string): boolean {
  return clientId === METRICS_DEMO_CLIENT_ID && clientSecret === env.metricsClientSecret;
}

function signPayload(payload: MetricsTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", env.metricsSandboxSecret)
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function issueMetricsToken(
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

export function verifyMetricsToken(token: string): MetricsTokenPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const expected = createHmac("sha256", env.metricsSandboxSecret)
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

export function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authorizationHeader.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}
