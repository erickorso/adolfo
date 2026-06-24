import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/price";
import { formatDate } from "@/lib/date";
import { listOrders } from "@/services/admin/moderation.service";

/** Pedidos (solo lectura). */
export default async function AdminOrdersPage() {
  const orders = await listOrders();
  const t = await getTranslations("admin");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        {t("orders")} ({orders.length})
      </h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noOrders")}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t("client")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
                <th className="px-3 py-2 font-medium">{t("price")}</th>
                <th className="px-3 py-2 font-medium">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-3 py-2">{o.user.email}</td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{o.status}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Price cents={o.totalCents} currency={o.currency} />
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
