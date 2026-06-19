import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/price";
import {
  listAllProducts,
  listAllServices,
} from "@/services/admin/moderation.service";
import {
  setProductActiveAction,
  setServiceActiveAction,
} from "@/app/admin/actions";

type Row = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  active: boolean;
};

function ModerationTable({
  title,
  rows,
  action,
}: {
  title: string;
  rows: Row[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">
        {title} ({rows.length})
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Precio</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">
                  <Price cents={r.priceCents} currency={r.currency} />
                </td>
                <td className="px-3 py-2">
                  <Badge variant={r.active ? "secondary" : "destructive"}>
                    {r.active ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <form action={action}>
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={r.active ? "false" : "true"}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {r.active ? "Desactivar" : "Activar"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Moderación de catálogo: activar / desactivar productos y servicios. */
export default async function AdminCatalogPage() {
  const [products, services] = await Promise.all([
    listAllProducts(),
    listAllServices(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <ModerationTable
        title="Productos"
        rows={products}
        action={setProductActiveAction}
      />
      <ModerationTable
        title="Servicios"
        rows={services}
        action={setServiceActiveAction}
      />
    </div>
  );
}
