import type { AnchorHTMLAttributes } from "react";

/**
 * Stub de @/i18n/navigation para tests: evita cargar el createNavigation de
 * next-intl (que importa next/navigation y no resuelve en vitest). Link rinde
 * un <a> simple, suficiente para asertar href/labels.
 */
export function Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string },
) {
  return <a {...props} />;
}

export const redirect = () => undefined;
export const usePathname = () => "/";
export const getPathname = () => "/";
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});
