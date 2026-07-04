import { getTranslations } from "next-intl/server";
import { CatalogInfiniteGrid } from "@/components/organisms/catalog-infinite-grid";
import { CartFlashBanner } from "@/components/molecules/cart-flash-banner";
import type { CatalogPage } from "@/services/catalog/catalog.service";

type CatalogTemplateProps = {
  products: CatalogPage;
  services: CatalogPage;
  added?: string;
  cartError?: string;
};

/**
 * Template del catálogo: secciones de productos y servicios, cada una con
 * scroll infinito. Recibe la primera página ya resuelta por el servidor.
 */
export async function CatalogTemplate({
  products,
  services,
  added,
  cartError,
}: CatalogTemplateProps) {
  const t = await getTranslations("catalog");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <CartFlashBanner added={added} cartError={cartError} />
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("products")}</h2>
        <CatalogInfiniteGrid
          kind="product"
          initialItems={products.items}
          initialCursor={products.nextCursor}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("services")}</h2>
        <CatalogInfiniteGrid
          kind="service"
          initialItems={services.items}
          initialCursor={services.nextCursor}
        />
      </section>
    </main>
  );
}
