import { NextResponse } from "next/server";
import { syncUserFromSession } from "@/services/users/user.service";
import { getOwnedResumeFileById } from "@/services/resume/resume.service";

export const runtime = "nodejs";

/**
 * Sirve un CV SOLO a su dueño (PII). Reemplaza a las signed URLs del proveedor
 * en el entorno local. Se referencia por id de CV, sin exponer la storageKey.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await syncUserFromSession();
  if (!user) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await params;
  const file = await getOwnedResumeFileById(user.id, id);
  if (!file) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": "inline",
    },
  });
}
