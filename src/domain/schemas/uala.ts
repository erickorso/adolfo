import { z } from "zod";

/**
 * Webhook de estado de orden (notification_url).
 * Docs: https://developers.ualabis.com.ar/v2/orders/create/webhook
 *
 * Ualá notifica vía POST JSON plano (sin firma HMAC documentada).
 */
export const ualaWebhookSchema = z.object({
  uuid: z.string().min(1),
  external_reference: z.string().min(1),
  status: z.enum(["APPROVED", "PROCESSED", "REJECTED"]),
  created_date: z.string(),
  api_version: z.string().optional(),
});

export type UalaWebhookPayload = z.infer<typeof ualaWebhookSchema>;
