import "server-only";
import { prisma } from "@/lib/prisma";
import type { CatalogItemVM } from "@/domain/view/catalog-item";
import { productToVM, serviceToVM } from "./catalog.mapper";

/**
 * Servicio de catálogo. Única responsabilidad: leer productos/servicios activos
 * y devolverlos como view models. La UI nunca ve modelos de Prisma.
 */

export async function listProducts(): Promise<CatalogItemVM[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(productToVM);
}

export async function listServices(): Promise<CatalogItemVM[]> {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return services.map(serviceToVM);
}
