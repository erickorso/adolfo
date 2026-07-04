import { CatalogTemplate } from "@/components/templates/catalog-template";
import { listCatalogPage } from "@/services/catalog/catalog.service";

type CatalogPageProps = {
  searchParams: Promise<{ added?: string; cartError?: string }>;
};

/**
 * Home = catálogo. Server Component: resuelve la primera página de productos y
 * servicios en paralelo; el scroll infinito carga el resto vía /api/catalog.
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [{ added, cartError }, products, services] = await Promise.all([
    searchParams,
    listCatalogPage("product"),
    listCatalogPage("service"),
  ]);

  return (
    <CatalogTemplate
      products={products}
      services={services}
      added={added}
      cartError={cartError}
    />
  );
}
