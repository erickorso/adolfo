import { NextResponse } from "next/server";
import { writeCartCookieOnResponse } from "@/lib/cart-cookie";
import { getAppBaseUrl } from "@/lib/app-url";
import { isSecureRequest } from "@/lib/cart-request";
import { processUalaWebhook } from "@/services/orders/order.service";

/**
 * Simula el webhook de Ualá tras un pago mock (dev / E2E).
 * Solo disponible fuera de producción.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "es";

  if (!orderId) {
    return NextResponse.redirect(
      new URL(`/${locale}/checkout/fail`, getAppBaseUrl()),
      303,
    );
  }

  const payload = {
    uuid: `mock-${orderId}`,
    external_reference: orderId,
    status: "APPROVED" as const,
    created_date: new Date().toISOString(),
    api_version: "2.0",
  };

  await processUalaWebhook(payload, { source: "mock-uala-pay", payload });

  const response = NextResponse.redirect(
    new URL(`/${locale}/checkout/success`, getAppBaseUrl()),
    303,
  );
  writeCartCookieOnResponse(response, [], isSecureRequest(request));
  return response;
}
