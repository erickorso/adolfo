export type NavMatch = "exact" | "prefix";

export function stripLocaleFromPathname(
  pathname: string,
  locales: readonly string[],
): string {
  for (const locale of locales) {
    const prefix = `/${locale}`;

    if (pathname === prefix) {
      return "/";
    }

    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }

  return pathname || "/";
}

export function isNavActive(
  pathname: string,
  href: string,
  match: NavMatch = "prefix",
): boolean {
  const normalized = pathname || "/";

  if (match === "exact") {
    return normalized === href;
  }

  return normalized === href || normalized.startsWith(`${href}/`);
}
