import { ItemKind } from "@/generated/prisma/client";
import type { Product, Service } from "@/generated/prisma/client";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

/**
 * Mappers puros Prisma -> view model. Sin dependencias de runtime (ni prisma
 * ni server-only) para que sean testeables de forma aislada.
 */

export function productToVM(product: Product): CatalogItemVM {
  return {
    id: product.id,
    kind: ItemKind.PRODUCT,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    imageUrl: product.imageUrl,
    available: product.stock > 0,
    meta: null,
  };
}

export function serviceToVM(service: Service): CatalogItemVM {
  return {
    id: service.id,
    kind: ItemKind.SERVICE,
    slug: service.slug,
    name: service.name,
    description: service.description,
    priceCents: service.priceCents,
    currency: service.currency,
    imageUrl: service.imageUrl,
    // Un servicio listado siempre se puede contratar.
    available: true,
    meta: service.durationMin ? `${service.durationMin} min` : null,
  };
}
