import { CatalogTemplate } from "@/components/templates/catalog-template";
import { listCatalogPage } from "@/services/catalog/catalog.service";

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ added?: string; cartError?: string }>;
};

/**
 * Home = catálogo. Server Component: resuelve la primera página de productos y
 * servicios en paralelo; el scroll infinito carga el resto vía /api/catalog.
 */
export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const [{ locale }, { added, cartError }] = await Promise.all([
    params,
    searchParams,
  ]);
  const [products, services] = await Promise.all([
    listCatalogPage("product", { locale }),
    listCatalogPage("service", { locale }),
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
