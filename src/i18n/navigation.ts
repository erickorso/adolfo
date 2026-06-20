import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de navegación con locale automático. Usar estos en vez de `next/link`
 * y `next/navigation` para que los links/redirects preserven el idioma actual.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
