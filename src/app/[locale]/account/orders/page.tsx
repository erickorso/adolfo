import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/price";
import { formatDate } from "@/lib/date";
import { listUserOrders } from "@/services/orders/list-user-orders.service";
import { getCurrentUser } from "@/services/users/user.service";

/** Historial de pedidos del usuario autenticado. */
export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/orders`);
  }

  const orders = await listUserOrders(user.id);
  const t = await getTranslations("orders");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/account"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToAccount")}
        </Link>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t("orderId")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
                <th className="px-3 py-2 font-medium">{t("total")}</th>
                <th className="px-3 py-2 font-medium">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">
                    …{order.id.slice(-8)}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">
                      {t(`status_${order.status}`)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <Price cents={order.totalCents} currency={order.currency} />
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
