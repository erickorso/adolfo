import { NextResponse } from "next/server";
import {
  getWebVitalsSummary,
  ingestWebVital,
} from "@/services/web-performance/web-vitals.service";

export const runtime = "nodejs";

/**
 * RUM Core Web Vitals de Adolfo.
 * POST body JSON: { name, value, rating, pathname, ... }
 * GET ?hours=168 → agregados P75.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const result = await ingestWebVital({
    name: String(b.name ?? ""),
    value: Number(b.value),
    rating: String(b.rating ?? ""),
    delta: b.delta != null ? Number(b.delta) : undefined,
    navigationType:
      typeof b.navigationType === "string" ? b.navigationType : undefined,
    pathname: typeof b.pathname === "string" ? b.pathname : "/",
    locale: typeof b.locale === "string" ? b.locale : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(request: Request) {
  const hours = Number(new URL(request.url).searchParams.get("hours") ?? "168");
  const windowHours =
    Number.isFinite(hours) && hours > 0 && hours <= 720 ? hours : 168;
  const summary = await getWebVitalsSummary(windowHours);
  return NextResponse.json(summary);
}
