import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Sirve imágenes PÚBLICAS del catálogo (sin auth). Restringido al prefijo
 * `catalog/` para no exponer otros objetos (ej. CVs privados).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const storageKey = key.join("/");

  if (!storageKey.startsWith("catalog/")) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  try {
    const bytes = await storage.getBytes(storageKey);
    const contentType = storageKey.endsWith(".png")
      ? "image/png"
      : storageKey.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }
}
