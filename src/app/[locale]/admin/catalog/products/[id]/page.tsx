import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getProductForEdit } from "@/services/admin/product-admin.service";
import { ProductEditForm } from "@/components/organisms/product-edit-form";

/** Edición de un producto (campos + propiedades custom). Protegida por el layout. */
export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForEdit(id);
  if (!product) {
    notFound();
  }

  const t = await getTranslations("admin");

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/admin/catalog"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        {t("backToCatalog")}
      </Link>
      <h2 className="text-xl font-semibold">
        {t("editProduct", { name: product.name })}
      </h2>
      <ProductEditForm
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          stock: product.stock,
          attributes: product.attributes.map((a) => ({
            name: a.name,
            value: a.value,
          })),
        }}
      />
    </div>
  );
}
