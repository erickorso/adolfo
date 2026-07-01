import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Middleware de i18n: detecta el locale y prefija las rutas (/es, /en).
export default createMiddleware(routing);

export const config = {
  // Excluye API, assets de Next y archivos con extensión.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
