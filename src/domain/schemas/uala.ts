import { z } from "zod";

/**
 * Esquema del webhook de Ualá Bis.
 * NOTA: ajustar los campos exactos contra la documentación oficial de Ualá.
 * Modelamos lo necesario para deduplicar e impactar el pago de forma segura.
 *
 * El body se valida con este esquema SOLO después de verificar la firma.
 */
export const ualaWebhookSchema = z.object({
  /** ID del cobro del lado de Ualá. */
  paymentId: z.string().min(1),
  /** Estado del pago reportado por Ualá. */
  status: z.enum(["APPROVED", "REJECTED", "PENDING", "REFUNDED"]),
  /** Monto en centavos. */
  amountCents: z.number().int().nonnegative(),
  currency: z.string().min(1),
  /** Eco de la clave de idempotencia que enviamos al crear el cobro. */
  idempotencyKey: z.string().min(1),
});

export type UalaWebhookPayload = z.infer<typeof ualaWebhookSchema>;
