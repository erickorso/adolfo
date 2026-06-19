import "server-only";
import { prisma } from "@/lib/prisma";
import type { CatalogItemVM } from "@/domain/view/catalog-item";
import { productToVM, serviceToVM } from "./catalog.mapper";

/**
 * Servicio de catálogo. Única responsabilidad: leer productos/servicios activos
 * y devolverlos como view models. La UI nunca ve modelos de Prisma.
 */

export type CatalogKind = "product" | "service";

/** Página de resultados con cursor para scroll infinito. */
export type CatalogPage = {
  items: CatalogItemVM[];
  nextCursor: string | null;
};

export const CATALOG_PAGE_SIZE = 12;

/**
 * Lee una página del catálogo (cursor-based). Trae `take + 1` para saber si hay
 * más y derivar el `nextCursor`. Orden estable por createdAt + id.
 */
export async function listCatalogPage(
  kind: CatalogKind,
  cursor: string | null = null,
  take: number = CATALOG_PAGE_SIZE,
): Promise<CatalogPage> {
  const args = {
    where: { active: true },
    orderBy: [{ createdAt: "desc" as const }, { id: "desc" as const }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  };

  if (kind === "product") {
    const rows = await prisma.product.findMany(args);
    const hasMore = rows.length > take;
    const page = rows.slice(0, take);
    return {
      items: page.map(productToVM),
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  }

  const rows = await prisma.service.findMany(args);
  const hasMore = rows.length > take;
  const page = rows.slice(0, take);
  return {
    items: page.map(serviceToVM),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}
