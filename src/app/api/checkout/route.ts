import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/app-url";
import { getCartFromCookie } from "@/lib/cart-cookie";
import { cartPageUrl, localeFromReferer } from "@/lib/cart-request";
import { checkoutInputSchema } from "@/domain/schemas/checkout";
import {
  CheckoutError,
  createCheckout,
} from "@/services/orders/order.service";
import { prisma } from "@/lib/prisma";

/** POST HTML nativo — inicia checkout Ualá leyendo el carrito desde cookie. */
export async function POST(request: Request): Promise<NextResponse> {
  const locale = localeFromReferer(request.headers.get("referer"));

  const session = await auth();
  if (!session?.user?.id) {
    const login = new URL(`/${locale}/login`, getAppBaseUrl());
    login.searchParams.set("callbackUrl", `/${locale}/cart`);
    return NextResponse.redirect(login, 303);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.status === "BANNED") {
    return NextResponse.redirect(
      cartPageUrl(locale, { checkoutError: "Tenés que iniciar sesión." }),
      303,
    );
  }

  const items = await getCartFromCookie();
  const parsed = checkoutInputSchema.safeParse({ items });
  if (!parsed.success) {
    return NextResponse.redirect(
      cartPageUrl(locale, {
        checkoutError: parsed.error.issues[0]?.message ?? "Carrito inválido.",
      }),
      303,
    );
  }

  if (items.length === 0) {
    return NextResponse.redirect(
      cartPageUrl(locale, { checkoutError: "Tu carrito está vacío." }),
      303,
    );
  }

  const base = getAppBaseUrl();

  try {
    const { checkoutUrl } = await createCheckout({
      userId: user.id,
      input: parsed.data,
      callbackSuccess: `${base}/${locale}/checkout/success`,
      callbackFail: `${base}/${locale}/checkout/fail`,
      notificationUrl: `${base}/api/webhooks/uala`,
    });
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    const message =
      error instanceof CheckoutError
        ? error.message
        : "No se pudo iniciar el pago. Intentá de nuevo.";
    console.error("POST /api/checkout:", error);
    return NextResponse.redirect(cartPageUrl(locale, { checkoutError: message }), 303);
  }
}
