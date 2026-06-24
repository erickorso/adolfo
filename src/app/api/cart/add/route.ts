import { NextResponse } from "next/server";
import { writeCartCookieOnResponse } from "@/lib/cart-cookie";
import { addToCart } from "@/services/cart/add-to-cart.service";

function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

/** POST HTML nativo (form action) — funciona sin JavaScript. */
export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const refId = String(formData.get("refId") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const returnTo = String(
    formData.get("returnTo") ?? request.headers.get("referer") ?? "/",
  );

  const result = await addToCart({ refId, kind });
  const target = new URL(returnTo, request.url);

  target.searchParams.delete("added");
  target.searchParams.delete("cartError");

  if (!result.ok) {
    target.searchParams.set("cartError", result.error);
    return NextResponse.redirect(target, 303);
  }

  target.searchParams.set("added", result.name);
  const response = NextResponse.redirect(target, 303);
  writeCartCookieOnResponse(response, result.items, isSecureRequest(request));
  return response;
}
