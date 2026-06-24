import { NextResponse } from "next/server";
import { writeCartCookieOnResponse } from "@/lib/cart-cookie";
import {
  isSecureRequest,
  localeFromReferer,
  resolveReturnTo,
} from "@/lib/cart-request";
import { setCartItemQuantity } from "@/services/cart/cart-mutation.service";

/** POST HTML nativo — actualiza cantidad de un ítem (sin JavaScript). */
export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const locale = localeFromReferer(request.headers.get("referer"));
  const target = resolveReturnTo(formData, request, locale);
  target.searchParams.delete("cartError");
  target.searchParams.delete("checkoutError");

  const result = await setCartItemQuantity({
    refId: String(formData.get("refId") ?? ""),
    kind: String(formData.get("kind") ?? ""),
    quantity: Number(formData.get("quantity") ?? 0),
  });

  if (!result.ok) {
    target.searchParams.set("cartError", result.error);
    return NextResponse.redirect(target, 303);
  }

  const response = NextResponse.redirect(target, 303);
  writeCartCookieOnResponse(response, result.items, isSecureRequest(request));
  return response;
}
