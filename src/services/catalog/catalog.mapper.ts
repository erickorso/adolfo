import { ITEM_KIND } from "@/domain/catalog/item-kind";
import {
  catalogLocalizedName,
  catalogLocalizedText,
} from "@/domain/catalog/catalog-i18n";
import type { Product, Service } from "@/generated/prisma/client";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

/**
 * Mappers puros Prisma -> view model. Sin dependencias de runtime (ni prisma
 * ni server-only) para que sean testeables de forma aislada.
 */

export function productToVM(
  product: Product,
  locale: string = "es",
): CatalogItemVM {
  return {
    id: product.id,
    kind: ITEM_KIND.PRODUCT,
    slug: product.slug,
    name: catalogLocalizedName(locale, product.name, product.nameEn),
    description: catalogLocalizedText(
      locale,
      product.description,
      product.descriptionEn,
    ),
    priceCents: product.priceCents,
    currency: product.currency,
    imageUrl: product.imageUrl,
    available: product.stock > 0,
    meta: null,
  };
}

export function serviceToVM(
  service: Service,
  locale: string = "es",
): CatalogItemVM {
  return {
    id: service.id,
    kind: ITEM_KIND.SERVICE,
    slug: service.slug,
    name: catalogLocalizedName(locale, service.name, service.nameEn),
    description: catalogLocalizedText(
      locale,
      service.description,
      service.descriptionEn,
    ),
    priceCents: service.priceCents,
    currency: service.currency,
    imageUrl: service.imageUrl,
    // Un servicio listado siempre se puede contratar.
    available: true,
    meta: service.durationMin ? `${service.durationMin} min` : null,
  };
}
