import { z } from "zod";
import { ItemKind } from "@/generated/prisma/client";

/**
 * Esquema de un ítem del carrito (estado de CLIENTE).
 * Guarda un snapshot mínimo del catálogo: lo justo para renderizar y cobrar.
 * El precio real se re-valida server-side en el checkout (nunca confiar en el cliente).
 */
export const cartItemSchema = z.object({
  /** id del Product o Service según `kind`. */
  refId: z.string().min(1),
  kind: z.enum(ItemKind),
  slug: z.string().min(1),
  name: z.string().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  currency: z.string().min(1).default("ARS"),
  imageUrl: z.string().optional(),
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

/** Payload mínimo para agregar algo al carrito (la cantidad por defecto es 1). */
export const addToCartInputSchema = cartItemSchema
  .omit({ quantity: true })
  .extend({ quantity: z.number().int().positive().default(1) });

export type AddToCartInput = z.infer<typeof addToCartInputSchema>;
