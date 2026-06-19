import type { ItemKind } from "@/domain/catalog/item-kind";

/**
 * View model de un ítem del catálogo (producto o servicio).
 *
 * Desacopla la UI de los modelos de Prisma: los componentes nunca tocan tipos
 * de la base de datos, solo este contrato estable. Toda la capa de presentación
 * consume `CatalogItemVM`.
 */
export type CatalogItemVM = {
  id: string;
  kind: ItemKind;
  slug: string;
  name: string;
  description: string | null;
  /** Precio en centavos. */
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  /** Si se puede agregar al carrito (stock para productos, activo para servicios). */
  available: boolean;
  /** Texto auxiliar contextual, ej. "60 min" para servicios. */
  meta: string | null;
};
