import { NextResponse } from "next/server";
import { z } from "zod";
import { cartItemSchema } from "@/domain/schemas/cart";
import {
  getCartFromCookie,
  writeCartCookieOnResponse,
} from "@/lib/cart-cookie";

const bodySchema = z.object({
  items: z.array(cartItemSchema),
});

function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

/** Devuelve el carrito persistido en cookie (sync cliente ↔ servidor). */
export async function GET(): Promise<NextResponse> {
  const items = await getCartFromCookie();
  return NextResponse.json({ items });
}

/** Reemplaza el carrito en cookie (mutaciones del cliente). */
export async function POST(request: Request): Promise<NextResponse> {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  writeCartCookieOnResponse(
    response,
    parsed.data.items,
    isSecureRequest(request),
  );
  return response;
}
