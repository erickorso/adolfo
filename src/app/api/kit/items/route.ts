import { NextResponse } from "next/server";
import { createKitItem, listKitItems } from "@/services/kit/kit.service";
import {
  getKitApiBaseUrl,
  proxyToKitApi,
} from "@/services/kit/kit-proxy";

export const runtime = "nodejs";

/** GET/POST /api/kit/items — BFF (Prisma) o proxy a Fastify si KIT_API_URL. */
export async function GET() {
  if (getKitApiBaseUrl()) {
    const upstream = await proxyToKitApi("/api/kit/items");
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const items = await listKitItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (getKitApiBaseUrl()) {
    const upstream = await proxyToKitApi("/api/kit/items", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await createKitItem(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ item: result.item }, { status: 201 });
}
