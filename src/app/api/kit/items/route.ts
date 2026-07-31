import { NextResponse } from "next/server";
import { createKitItem, listKitItems } from "@/services/kit/kit.service";

export const runtime = "nodejs";

/** GET/POST /api/kit/items — BFF del Kit fullstack (Postgres). */
export async function GET() {
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
  const result = await createKitItem(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ item: result.item }, { status: 201 });
}
