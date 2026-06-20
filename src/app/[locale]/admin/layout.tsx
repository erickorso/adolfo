import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/admin-guard";

const NAV = [
  { href: "/admin", key: "dashboard" },
  { href: "/admin/users", key: "users" },
  { href: "/admin/catalog", key: "catalog" },
  { href: "/admin/jobs", key: "jobs" },
  { href: "/admin/orders", key: "orders" },
] as const;

/**
 * Layout del backoffice. Protegido: requireAdmin() redirige si no sos admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <span className="text-sm text-muted-foreground">
          {admin.email} · {admin.role}
        </span>
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-border pb-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
