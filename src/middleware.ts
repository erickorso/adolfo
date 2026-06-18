import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

/**
 * Middleware de Auth0 (SDK v4).
 * Intercepta /auth/* para montar login, logout y callback, y refresca la sesión
 * en el resto de las rutas.
 */
export async function middleware(request: NextRequest) {
  return auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todo MENOS:
     * - assets estáticos de Next (_next/static, _next/image)
     * - favicon e imágenes públicas
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
