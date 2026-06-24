import { NextResponse } from "next/server";
import { ualaWebhookSchema } from "@/domain/schemas/uala";
import { processUalaWebhook } from "@/services/orders/order.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Ualá Bis v2 (notification_url).
 * POST JSON plano; responder 200 para ack.
 * Docs: https://developers.ualabis.com.ar/v2/orders/create/webhook
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = ualaWebhookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const result = await processUalaWebhook(parsed.data, json);
  return NextResponse.json(result, { status: 200 });
}
