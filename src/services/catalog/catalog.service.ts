import "server-only";
import { prisma } from "@/lib/prisma";
import type { CatalogItemVM } from "@/domain/view/catalog-item";
import type { ProductDetailVM } from "@/domain/view/product-detail";
import { productToVM, serviceToVM } from "./catalog.mapper";

/**
 * Servicio de catálogo. Lee productos/servicios activos como view models y
 * soporta paginación cursor-based + búsqueda (incluye propiedades de producto).
 */

export type CatalogKind = "product" | "service";

export type CatalogPage = {
  items: CatalogItemVM[];
  nextCursor: string | null;
};

export const CATALOG_PAGE_SIZE = 12;

type ListOptions = {
  cursor?: string | null;
  q?: string | null;
  take?: number;
};

const insensitive = (q: string) => ({ contains: q, mode: "insensitive" as const });

/**
 * Lee una página del catálogo (cursor-based). `q` busca por nombre/descripción
 * y, en productos, también por nombre/valor de sus propiedades custom.
 */
export async function listCatalogPage(
  kind: CatalogKind,
  options: ListOptions = {},
): Promise<CatalogPage> {
  const take = options.take ?? CATALOG_PAGE_SIZE;
  const cursor = options.cursor ?? null;
  const q = options.q?.trim() || null;
  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
  const pageArgs = {
    orderBy,
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  };

  if (kind === "product") {
    const where = {
      active: true,
      ...(q
        ? {
            OR: [
              { name: insensitive(q) },
              { description: insensitive(q) },
              {
                attributes: {
                  some: {
                    OR: [{ name: insensitive(q) }, { value: insensitive(q) }],
                  },
                },
              },
            ],
          }
        : {}),
    };
    const rows = await prisma.product.findMany({ where, ...pageArgs });
    const hasMore = rows.length > take;
    const page = rows.slice(0, take);
    return {
      items: page.map(productToVM),
      nextCursor: hasMore ? page[page.length - 1].id : null,
    };
  }

  const where = {
    active: true,
    ...(q ? { OR: [{ name: insensitive(q) }, { description: insensitive(q) }] } : {}),
  };
  const rows = await prisma.service.findMany({ where, ...pageArgs });
  const hasMore = rows.length > take;
  const page = rows.slice(0, take);
  return {
    items: page.map(serviceToVM),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}

/** Detalle de un producto activo por slug (con sus propiedades). */
export async function getProductDetail(
  slug: string,
): Promise<ProductDetailVM | null> {
  const p = await prisma.product.findFirst({
    where: { slug, active: true },
    include: { attributes: { orderBy: { name: "asc" } } },
  });
  if (!p) {
    return null;
  }
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    currency: p.currency,
    imageUrl: p.imageUrl,
    available: p.stock > 0,
    attributes: p.attributes.map((a) => ({ name: a.name, value: a.value })),
  };
}
