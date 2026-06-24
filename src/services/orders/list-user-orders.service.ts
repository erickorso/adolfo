import "server-only";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type UserOrderSummary = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  createdAt: Date;
  itemCount: number;
  paymentStatus: PaymentStatus | null;
};

/** Pedidos del usuario autenticado (más recientes primero). */
export async function listUserOrders(
  userId: string,
): Promise<UserOrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { quantity: true } },
      payment: { select: { status: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalCents: order.totalCents,
    currency: order.currency,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((n, item) => n + item.quantity, 0),
    paymentStatus: order.payment?.status ?? null,
  }));
}

export type UserOrderDetail = UserOrderSummary & {
  items: Array<{
    nameSnapshot: string;
    quantity: number;
    unitPriceCents: number;
  }>;
};

export async function getUserOrder(
  userId: string,
  orderId: string,
): Promise<UserOrderDetail | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        select: {
          nameSnapshot: true,
          quantity: true,
          unitPriceCents: true,
        },
      },
      payment: { select: { status: true } },
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    status: order.status,
    totalCents: order.totalCents,
    currency: order.currency,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((n, item) => n + item.quantity, 0),
    paymentStatus: order.payment?.status ?? null,
    items: order.items,
  };
}
