import { CatalogGrid } from "@/components/organisms/catalog-grid";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogTemplateProps = {
  products: CatalogItemVM[];
  services: CatalogItemVM[];
};

/**
 * Template del catálogo: estructura la página en secciones de productos y
 * servicios. Sin lógica de datos — solo layout. Recibe los VMs ya resueltos.
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
        <CatalogGrid
          items={products}
          emptyMessage="Todavía no hay productos cargados."
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Servicios</h2>
        <CatalogGrid
          items={services}
          emptyMessage="Todavía no hay servicios cargados."
        />
      </section>
    </main>
  );
}
