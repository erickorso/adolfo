import { NextResponse } from "next/server";
import { listCatalogPage } from "@/services/catalog/catalog.service";

export const runtime = "nodejs";

/**
 * Página del catálogo para el scroll infinito (público).
 * GET /api/catalog?kind=product|service&cursor=<id>
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const cursor = url.searchParams.get("cursor");

  if (kind !== "product" && kind !== "service") {
    return NextResponse.json({ error: "kind inválido" }, { status: 400 });
  }

  const page = await listCatalogPage(kind, cursor);
  return NextResponse.json(page);
}
