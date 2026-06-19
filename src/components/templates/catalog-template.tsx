import { CatalogInfiniteGrid } from "@/components/organisms/catalog-infinite-grid";
import type { CatalogPage } from "@/services/catalog/catalog.service";

type CatalogTemplateProps = {
  products: CatalogPage;
  services: CatalogPage;
};

/**
 * Template del catálogo: secciones de productos y servicios, cada una con
 * scroll infinito. Recibe la primera página ya resuelta por el servidor.
 */
export function CatalogTemplate({ products, services }: CatalogTemplateProps) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="text-muted-foreground">Productos y servicios disponibles.</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <CatalogInfiniteGrid
          kind="product"
          initialItems={products.items}
          initialCursor={products.nextCursor}
          emptyMessage="Todavía no hay productos cargados."
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Servicios</h2>
        <CatalogInfiniteGrid
          kind="service"
          initialItems={services.items}
          initialCursor={services.nextCursor}
          emptyMessage="Todavía no hay servicios cargados."
        />
      </section>
    </main>
  );
}
