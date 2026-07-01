import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { stripLocaleFromPathname } from "@/lib/nav-active";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const pathname = stripLocaleFromPathname(
    request.nextUrl.pathname,
    routing.locales,
  );

  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  // Excluye API, assets de Next y archivos con extensión.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
