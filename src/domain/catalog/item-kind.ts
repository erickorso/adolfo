/**
 * Tipo de ítem del catálogo. Const propio (no el enum generado de Prisma) para
 * NO acoplar el bundle del cliente al runtime de Prisma. Los valores coinciden
 * con el enum `ItemKind` de la DB, así que Prisma los acepta tal cual.
 */
export const ITEM_KIND = {
  PRODUCT: "PRODUCT",
  SERVICE: "SERVICE",
} as const;

export type ItemKind = (typeof ITEM_KIND)[keyof typeof ITEM_KIND];
