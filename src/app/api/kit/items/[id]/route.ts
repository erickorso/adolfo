import { NextResponse } from "next/server";
import { deleteKitItem, updateKitItem } from "@/services/kit/kit.service";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH/DELETE /api/kit/items/:id */
export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const result = await updateKitItem(id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ item: result.item });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const result = await deleteKitItem(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
