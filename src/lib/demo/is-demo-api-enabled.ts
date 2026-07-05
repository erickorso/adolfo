import { NextResponse } from "next/server";

/** Activo por defecto. Desactivar con DEMO_PUBLIC_APIS_ENABLED=false. */
export function isDemoPublicApiEnabled(): boolean {
  return process.env.DEMO_PUBLIC_APIS_ENABLED !== "false";
}

export function demoPublicApiDisabledResponse(): NextResponse {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
