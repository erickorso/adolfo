import { NextResponse } from "next/server";
import { writeCartCookieOnResponse } from "@/lib/cart-cookie";
import {
  isSecureRequest,
  localeFromReferer,
  resolveReturnTo,
} from "@/lib/cart-request";
import { clearCartItems } from "@/services/cart/cart-mutation.service";

/** POST HTML nativo — vacía el carrito (sin JavaScript). */
export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const locale = localeFromReferer(request.headers.get("referer"));
  const target = resolveReturnTo(formData, request, locale);
  target.searchParams.delete("cartError");
  target.searchParams.delete("checkoutError");

  const response = NextResponse.redirect(target, 303);
  writeCartCookieOnResponse(response, await clearCartItems(), isSecureRequest(request));
  return response;
}
