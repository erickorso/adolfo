import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/catalog", label: "Catálogo" },
  { href: "/admin/jobs", label: "Empleos" },
  { href: "/admin/orders", label: "Pedidos" },
];

/**
 * Layout del backoffice. Protegido: requireAdmin() redirige si no sos admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Backoffice</h1>
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
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
