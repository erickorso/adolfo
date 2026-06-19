import { CatalogTemplate } from "@/components/templates/catalog-template";
import { listCatalogPage } from "@/services/catalog/catalog.service";

/**
 * Home = catálogo. Server Component: resuelve la primera página de productos y
 * servicios en paralelo; el scroll infinito carga el resto vía /api/catalog.
 */
export default async function CatalogPage() {
  const [products, services] = await Promise.all([
    listCatalogPage("product"),
    listCatalogPage("service"),
  ]);

  return <CatalogTemplate products={products} services={services} />;
}
