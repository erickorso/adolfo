import "server-only";
import { prisma } from "@/lib/prisma";
import { emailProvider } from "@/services/email";
import {
  buildOrderConfirmationEmail,
  type OrderConfirmationInput,
} from "./order-confirmation";

/** Envía el email de confirmación tras un pago aprobado. */
export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: true,
    },
  });

  if (!order?.user.email) {
    return;
  }

  const input: OrderConfirmationInput = {
    orderId: order.id,
    customerName: order.user.name,
    customerEmail: order.user.email,
    totalCents: order.totalCents,
    currency: order.currency,
    items: order.items.map((item) => ({
      name: item.nameSnapshot,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
  };

  const { subject, html, text } = buildOrderConfirmationEmail(input);
  await emailProvider.send({
    to: order.user.email,
    subject,
    html,
    text,
  });
}
