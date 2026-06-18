import { CatalogTemplate } from "@/components/templates/catalog-template";
import { listProducts, listServices } from "@/services/catalog/catalog.service";

/**
 * Home = catálogo. Server Component: resuelve los datos en el servidor
 * (sin useEffect+fetch). Productos y servicios se cargan en paralelo.
 */
export default async function CatalogPage() {
  const [products, services] = await Promise.all([
    listProducts(),
    listServices(),
  ]);

  return <CatalogTemplate products={products} services={services} />;
}
