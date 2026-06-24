import "server-only";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { z } from "zod";
import {
  cartItemSchema,
  type CartItem,
} from "@/domain/schemas/cart";

export const CART_COOKIE_NAME = "app-cart";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

const cartSchema = z.array(cartItemSchema);

export function getCartCookieOptions(secure: boolean) {
  return {
    path: "/",
    maxAge: MAX_AGE_SEC,
    sameSite: "lax" as const,
    httpOnly: true,
    secure,
  };
}

export function writeCartCookieOnResponse(
  response: NextResponse,
  items: CartItem[],
  secure: boolean,
): void {
  response.cookies.set(
    CART_COOKIE_NAME,
    JSON.stringify(items),
    getCartCookieOptions(secure),
  );
}

export async function getCartFromCookie(): Promise<CartItem[]> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE_NAME)?.value;
  if (!raw) {
    return [];
  }
  try {
    return cartSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function setCartCookie(items: CartItem[]): Promise<void> {
  const jar = await cookies();
  jar.set(
    CART_COOKIE_NAME,
    JSON.stringify(items),
    getCartCookieOptions(process.env.NODE_ENV === "production"),
  );
}

function itemKey(refId: string, kind: CartItem["kind"]): string {
  return `${kind}:${refId}`;
}

export function mergeCartItem(
  items: CartItem[],
  input: CartItem,
): CartItem[] {
  const key = itemKey(input.refId, input.kind);
  const existing = items.find((i) => itemKey(i.refId, i.kind) === key);
  if (existing) {
    return items.map((i) =>
      itemKey(i.refId, i.kind) === key
        ? { ...i, quantity: i.quantity + input.quantity }
        : i,
    );
  }
  return [...items, input];
}

export async function mergeIntoCartCookie(
  input: CartItem,
): Promise<CartItem[]> {
  const items = mergeCartItem(await getCartFromCookie(), input);
  await setCartCookie(items);
  return items;
}

export async function replaceCartCookie(items: CartItem[]): Promise<void> {
  await setCartCookie(items);
}

export function countCartItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/** @deprecated Usar mergeIntoCartCookie */
export async function addItemToCartCookie(input: CartItem): Promise<void> {
  await mergeIntoCartCookie(input);
}
