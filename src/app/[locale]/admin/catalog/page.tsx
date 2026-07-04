import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/price";
import {
  listAllProducts,
  listAllServices,
} from "@/services/admin/moderation.service";
import {
  setProductActiveAction,
  setServiceActiveAction,
  uploadCatalogImageAction,
} from "@/app/[locale]/admin/actions";

type Row = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  active: boolean;
  imageUrl: string | null;
};

async function ModerationTable({
  type,
  rows,
  toggleAction,
}: {
  type: "product" | "service";
  rows: Row[];
  toggleAction: (formData: FormData) => Promise<void>;
}) {
  const t = await getTranslations("admin");
  const title = type === "product" ? t("products") : t("services");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">
        {title} ({rows.length})
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">{t("image")}</th>
              <th className="px-3 py-2 font-medium">{t("name")}</th>
              <th className="px-3 py-2 font-medium">{t("price")}</th>
              <th className="px-3 py-2 font-medium">{t("status")}</th>
              <th className="px-3 py-2 font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-3 py-2">
                  {r.imageUrl ? (
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      width={44}
                      height={44}
                      className="size-11 rounded object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">
                  <Price cents={r.priceCents} currency={r.currency} />
                </td>
                <td className="px-3 py-2">
                  <Badge variant={r.active ? "secondary" : "destructive"}>
                    {r.active ? t("active") : t("inactive")}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {type === "product" ? (
                      <Link
                        href={`/admin/catalog/products/${r.id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                        )}
                      >
                        {t("edit")}
                      </Link>
                    ) : null}
                    <form action={toggleAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={r.active ? "false" : "true"}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        {r.active ? t("deactivate") : t("activate")}
                      </Button>
                    </form>
                    <form
                      action={uploadCatalogImageAction}
                      className="flex items-center gap-1"
                    >
                      <input type="hidden" name="type" value={type} />
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="file"
                        name="file"
                        required
                        accept="image/jpeg,image/png,image/webp"
                        aria-label={t("uploadPhoto")}
                        className="max-w-40 text-xs"
                      />
                      <Button type="submit" size="sm" variant="outline">
                        {t("uploadPhoto")}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Moderación de catálogo: activar / desactivar + subir foto. */
export default async function AdminCatalogPage() {
  const [products, services] = await Promise.all([
    listAllProducts(),
    listAllServices(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <ModerationTable
        type="product"
        rows={products}
        toggleAction={setProductActiveAction}
      />
      <ModerationTable
        type="service"
        rows={services}
        toggleAction={setServiceActiveAction}
      />
    </div>
  );
}
