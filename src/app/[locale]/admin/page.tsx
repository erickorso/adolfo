import { getTranslations } from "next-intl/server";
import { adminCounts } from "@/services/admin/moderation.service";

/** Dashboard del backoffice: conteos básicos. */
export default async function AdminDashboardPage() {
  const counts = await adminCounts();
  const t = await getTranslations("admin");
  const cards = [
    { label: t("users"), value: counts.users },
    { label: t("products"), value: counts.products },
    { label: t("services"), value: counts.services },
    { label: t("jobs"), value: counts.jobs },
    { label: t("orders"), value: counts.orders },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-border bg-card p-4 text-card-foreground"
        >
          <div className="text-3xl font-bold tabular-nums">{c.value}</div>
          <div className="text-sm text-muted-foreground">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
