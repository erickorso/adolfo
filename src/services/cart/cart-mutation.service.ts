import "server-only";
import { z } from "zod";
import { ITEM_KIND } from "@/domain/catalog/item-kind";
import type { CartItem } from "@/domain/schemas/cart";
import { getCartFromCookie } from "@/lib/cart-cookie";
import { ItemKind } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const itemKeySchema = z.object({
  refId: z.string().min(1),
  kind: z.enum(ITEM_KIND),
});

const quantitySchema = z.object({
  refId: z.string().min(1),
  kind: z.enum(ITEM_KIND),
  quantity: z.coerce.number().int().positive().max(99),
});

function itemKey(refId: string, kind: CartItem["kind"]): string {
  return `${kind}:${refId}`;
}

export type CartMutationResult =
  | { ok: true; items: CartItem[] }
  | { ok: false; error: string };

export async function clearCartItems(): Promise<CartItem[]> {
  return [];
}

export async function removeCartItem(params: {
  refId: string;
  kind: string;
}): Promise<CartMutationResult> {
  const parsed = itemKeySchema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: "Ítem inválido." };
  }

  const key = itemKey(parsed.data.refId, parsed.data.kind);
  const items = (await getCartFromCookie()).filter(
    (i) => itemKey(i.refId, i.kind) !== key,
  );

  return { ok: true, items };
}

async function validateProductStock(
  refId: string,
  quantity: number,
): Promise<string | null> {
  const product = await prisma.product.findFirst({
    where: { id: refId, active: true },
  });
  if (!product) {
    return "Producto no disponible.";
  }
  if (product.stock < quantity) {
    return `Stock insuficiente para ${product.name}.`;
  }
  return null;
}

export async function setCartItemQuantity(params: {
  refId: string;
  kind: string;
  quantity: number;
}): Promise<CartMutationResult> {
  const parsed = quantitySchema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: "Cantidad inválida." };
  }

  const { refId, kind, quantity } = parsed.data;
  const key = itemKey(refId, kind);
  const current = await getCartFromCookie();
  const existing = current.find((i) => itemKey(i.refId, i.kind) === key);

  if (!existing) {
    return { ok: false, error: "Ítem no encontrado en el carrito." };
  }

  if (kind === ItemKind.PRODUCT) {
    const stockError = await validateProductStock(refId, quantity);
    if (stockError) {
      return { ok: false, error: stockError };
    }
  }

  const items = current.map((i) =>
    itemKey(i.refId, i.kind) === key ? { ...i, quantity } : i,
  );

  return { ok: true, items };
}
