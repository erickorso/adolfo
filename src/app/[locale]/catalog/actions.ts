"use server";

import { addToCart } from "@/services/cart/add-to-cart.service";
import { replaceCartCookie } from "@/lib/cart-cookie";
import type { AddToCartInput } from "@/domain/schemas/cart";

export type AddToCartActionResult = {
  error?: string;
  success?: boolean;
  item?: AddToCartInput;
};

/** Carrito anónimo — acción pública; el checkout exige sesión. */
export async function addToCartAction(
  _prev: AddToCartActionResult,
  formData: FormData,
): Promise<AddToCartActionResult> {
  const result = await addToCart({
    refId: String(formData.get("refId") ?? ""),
    kind: String(formData.get("kind") ?? ""),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await replaceCartCookie(result.items);

  return { success: true };
}
