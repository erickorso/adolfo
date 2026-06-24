import "server-only";
import { z } from "zod";
import { ITEM_KIND } from "@/domain/catalog/item-kind";
import type { CartItem } from "@/domain/schemas/cart";
import { addToCartInputSchema } from "@/domain/schemas/cart";
import { getCartFromCookie, mergeCartItem } from "@/lib/cart-cookie";
import { prisma } from "@/lib/prisma";
import { ItemKind } from "@/generated/prisma/client";

const addFormSchema = z.object({
  refId: z.string().min(1),
  kind: z.enum(ITEM_KIND),
});

async function resolveCartItem(
  refId: string,
  kind: (typeof ITEM_KIND)[keyof typeof ITEM_KIND],
): Promise<CartItem | null> {
  if (kind === ITEM_KIND.PRODUCT) {
    const product = await prisma.product.findFirst({
      where: { id: refId, active: true },
    });
    if (!product || product.stock < 1) {
      return null;
    }
    return {
      refId: product.id,
      kind: ItemKind.PRODUCT,
      slug: product.slug,
      name: product.name,
      unitPriceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl ?? undefined,
      quantity: 1,
    };
  }

  const service = await prisma.service.findFirst({
    where: { id: refId, active: true },
  });
  if (!service) {
    return null;
  }
  return {
    refId: service.id,
    kind: ItemKind.SERVICE,
    slug: service.slug,
    name: service.name,
    unitPriceCents: service.priceCents,
    currency: service.currency,
    imageUrl: service.imageUrl ?? undefined,
    quantity: 1,
  };
}

export type AddToCartResult =
  | { ok: true; name: string; items: CartItem[] }
  | { ok: false; error: string };

/** Resuelve ítem y devuelve el carrito mergeado (sin escribir cookie). */
export async function addToCart(params: {
  refId: string;
  kind: string;
}): Promise<AddToCartResult> {
  const parsed = addFormSchema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: "Ítem inválido." };
  }

  const item = await resolveCartItem(parsed.data.refId, parsed.data.kind);
  if (!item) {
    return { ok: false, error: "Producto no disponible." };
  }

  const validated = addToCartInputSchema.safeParse(item);
  if (!validated.success) {
    return { ok: false, error: "No se pudo agregar al carrito." };
  }

  const current = await getCartFromCookie();
  const items = mergeCartItem(current, validated.data);

  return { ok: true, name: validated.data.name, items };
}
