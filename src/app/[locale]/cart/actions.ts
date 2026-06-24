"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { getAppBaseUrl } from "@/lib/app-url";
import { getCurrentUser } from "@/services/users/user.service";
import {
  CheckoutError,
  createCheckout,
} from "@/services/orders/order.service";
import { checkoutInputSchema } from "@/domain/schemas/checkout";

export type CheckoutActionResult = {
  error?: string;
  checkoutUrl?: string;
};

/**
 * Inicia el checkout: valida el carrito server-side, crea el pedido y devuelve
 * la URL de pago de Ualá (o redirige si el cliente prefiere server redirect).
 */
export async function checkoutAction(
  input: unknown,
): Promise<CheckoutActionResult> {
  const user = await getCurrentUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/cart`);
  }

  const parsed = checkoutInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Carrito inválido.",
    };
  }

  const base = getAppBaseUrl();
  const callbackSuccess = `${base}/${locale}/checkout/success`;
  const callbackFail = `${base}/${locale}/checkout/fail`;
  const notificationUrl = `${base}/api/webhooks/uala`;

  try {
    const { checkoutUrl } = await createCheckout({
      userId: user.id,
      input: parsed.data,
      callbackSuccess,
      callbackFail,
      notificationUrl,
    });
    return { checkoutUrl };
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { error: error.message };
    }
    console.error("checkoutAction:", error);
    return { error: "No se pudo iniciar el pago. Intentá de nuevo." };
  }
}
