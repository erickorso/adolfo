import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isNavActive } from "@/lib/nav-active";
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

type SiteNavLinksProps = {
  pathname: string;
};

export async function SiteNavLinks({ pathname }: SiteNavLinksProps) {
  const t = await getTranslations("nav");

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
              "text-sm transition-colors",
              active
                ? "font-semibold text-foreground underline decoration-2 underline-offset-4"
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
