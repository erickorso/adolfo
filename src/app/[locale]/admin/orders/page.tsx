import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/price";
import { formatDate } from "@/lib/date";
import { listOrders } from "@/services/admin/moderation.service";

/** Pedidos (solo lectura). Se poblará al conectar el checkout. */
export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Pedidos ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay pedidos (se crean al conectar el checkout).
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Cliente</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium">Total</th>
                <th className="px-3 py-2 font-medium">Fecha</th>
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
