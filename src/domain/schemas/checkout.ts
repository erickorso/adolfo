import { z } from "zod";
import { cartItemSchema } from "./cart";

/**
 * Input del checkout que llega desde el cliente.
 * Server-side se re-resuelven precios y stock contra la DB: este esquema solo
 * garantiza la FORMA, no la veracidad de los precios.
 */
export const checkoutInputSchema = z.object({
  items: z.array(cartItemSchema).min(1, "El carrito está vacío"),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
