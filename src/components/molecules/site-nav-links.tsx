"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  labelKey: "catalog" | "jobs" | "courses" | "sandbox3d" | "aiAgents" | "account";
  match?: "exact" | "prefix";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "catalog", match: "exact" },
  { href: "/jobs", labelKey: "jobs" },
  { href: "/courses", labelKey: "courses" },
  { href: "/sandbox/3d", labelKey: "sandbox3d" },
  { href: "/learn/ai-agents", labelKey: "aiAgents" },
  { href: "/account", labelKey: "account" },
];

export function isNavActive(
  pathname: string,
  href: string,
  match: NavItem["match"] = "prefix",
): boolean {
  const normalized = pathname || "/";

  if (match === "exact") {
    return normalized === href;
  }

  return normalized === href || normalized.startsWith(`${href}/`);
}

export function SiteNavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.href, item.match);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              item.href === "/" ? "text-lg" : "text-sm",
              active
                ? "font-bold text-foreground"
                : "font-normal text-muted-foreground hover:text-foreground",
            )}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </>
  );
}
