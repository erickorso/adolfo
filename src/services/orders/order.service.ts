import "server-only";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import {
  ItemKind,
  OrderStatus,
  PaymentStatus,
} from "@/generated/prisma/client";
import { ITEM_KIND } from "@/domain/catalog/item-kind";
import type { CheckoutInput } from "@/domain/schemas/checkout";
import { checkoutInputSchema } from "@/domain/schemas/checkout";
import type { UalaWebhookPayload } from "@/domain/schemas/uala";
import { sumLineItemsCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { validateUalaCallbackUrls } from "@/lib/uala-callback-urls";
import { ualaService, UalaApiError } from "@/services/payments/uala.service";

export type CheckoutErrorCode =
  | "CONFIG"
  | "VALIDATION"
  | "PAYMENT";

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly code: CheckoutErrorCode,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

type ResolvedLine = {
  kind: ItemKind;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  productId?: string;
  serviceId?: string;
};

function isUalaConfigured(): boolean {
  const secretId = env.UALA_CLIENT_SECRET_ID ?? env.UALA_CLIENT_SECRET;
  return Boolean(
    env.UALA_USERNAME &&
      env.UALA_CLIENT_ID &&
      secretId &&
      (env.UALA_CHECKOUT_URL ?? env.UALA_API_BASE_URL),
  );
}

/** Resuelve líneas del carrito contra la DB (precio y stock reales). */
export async function resolveCheckoutLines(
  input: CheckoutInput,
): Promise<ResolvedLine[]> {
  const lines: ResolvedLine[] = [];

  for (const item of input.items) {
    if (item.kind === ITEM_KIND.PRODUCT) {
      const product = await prisma.product.findFirst({
        where: { id: item.refId, active: true },
      });
      if (!product) {
        throw new CheckoutError(
          `Producto no disponible: ${item.name}`,
          "VALIDATION",
        );
      }
      if (product.stock < item.quantity) {
        throw new CheckoutError(
          `Stock insuficiente para ${product.name}`,
          "VALIDATION",
        );
      }
      lines.push({
        kind: ItemKind.PRODUCT,
        nameSnapshot: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
        productId: product.id,
      });
      continue;
    }

    const service = await prisma.service.findFirst({
      where: { id: item.refId, active: true },
    });
    if (!service) {
      throw new CheckoutError(
        `Servicio no disponible: ${item.name}`,
        "VALIDATION",
      );
    }
    lines.push({
      kind: ItemKind.SERVICE,
      nameSnapshot: service.name,
      unitPriceCents: service.priceCents,
      quantity: item.quantity,
      serviceId: service.id,
    });
  }

  return lines;
}

async function releaseProductStock(
  tx: Prisma.TransactionClient,
  items: ReadonlyArray<{
    kind: ItemKind;
    productId: string | null;
    quantity: number;
  }>,
): Promise<void> {
  for (const item of items) {
    if (item.kind !== ItemKind.PRODUCT || !item.productId) {
      continue;
    }
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}

/** Cancela un pedido pendiente y libera stock reservado. */
export async function cancelPendingOrder(orderId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });
    if (!order || order.status !== OrderStatus.AWAITING_PAYMENT) {
      return;
    }

    await releaseProductStock(tx, order.items);
    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: PaymentStatus.REJECTED },
      });
    }
  });
}

/**
 * Crea el pedido, reserva stock, registra el pago y devuelve la URL de Ualá.
 */
export async function createCheckout(params: {
  userId: string;
  input: CheckoutInput;
  callbackSuccess: string;
  callbackFail: string;
  notificationUrl: string;
}): Promise<{ checkoutUrl: string; orderId: string }> {
  if (!isUalaConfigured()) {
    throw new CheckoutError(
      "Pagos no configurados. Completá las variables UALA_* en el entorno.",
      "CONFIG",
    );
  }

  const parsed = checkoutInputSchema.safeParse(params.input);
  if (!parsed.success) {
    throw new CheckoutError(
      parsed.error.issues[0]?.message ?? "Carrito inválido.",
      "VALIDATION",
    );
  }

  const callbackError = validateUalaCallbackUrls({
    callbackSuccess: params.callbackSuccess,
    callbackFail: params.callbackFail,
    notificationUrl: params.notificationUrl,
  });
  if (callbackError) {
    throw new CheckoutError(callbackError, "CONFIG");
  }

  const lines = await resolveCheckoutLines(parsed.data);
  const totalCents = sumLineItemsCents(lines);
  const currency = parsed.data.items[0]?.currency ?? "ARS";
  const idempotencyKey = randomUUID();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: params.userId,
        status: OrderStatus.AWAITING_PAYMENT,
        totalCents,
        currency,
        items: {
          create: lines.map((line) => ({
            kind: line.kind,
            productId: line.productId,
            serviceId: line.serviceId,
            nameSnapshot: line.nameSnapshot,
            unitPriceCents: line.unitPriceCents,
            quantity: line.quantity,
          })),
        },
        payment: {
          create: {
            idempotencyKey,
            amountCents: totalCents,
            currency,
            status: PaymentStatus.PENDING,
          },
        },
      },
      include: { payment: true },
    });

    for (const line of lines) {
      if (line.kind !== ItemKind.PRODUCT || !line.productId) {
        continue;
      }
      const updated = await tx.product.updateMany({
        where: { id: line.productId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (updated.count === 0) {
        throw new CheckoutError(
          `Stock insuficiente para ${line.nameSnapshot}`,
          "VALIDATION",
        );
      }
    }

    return created;
  });

  try {
    const charge = await ualaService.createOrder({
      amountCents: totalCents,
      orderId: order.id,
      description: `Pedido ${order.id.slice(-8)}`,
      callbackSuccess: params.callbackSuccess,
      callbackFail: params.callbackFail,
      notificationUrl: params.notificationUrl,
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: { providerPaymentId: charge.orderUuid },
    });

    return { checkoutUrl: charge.checkoutUrl, orderId: order.id };
  } catch (error) {
    await cancelPendingOrder(order.id);
    if (error instanceof UalaApiError) {
      throw new CheckoutError(error.message, "PAYMENT");
    }
    throw error;
  }
}

export function mapUalaPaymentStatus(
  status: UalaWebhookPayload["status"],
): PaymentStatus {
  switch (status) {
    case "APPROVED":
    case "PROCESSED":
      return PaymentStatus.APPROVED;
    case "REJECTED":
      return PaymentStatus.REJECTED;
    default:
      return PaymentStatus.PENDING;
  }
}

export function mapUalaOrderStatus(
  status: UalaWebhookPayload["status"],
): OrderStatus | null {
  switch (status) {
    case "APPROVED":
    case "PROCESSED":
      return OrderStatus.PAID;
    case "REJECTED":
      return OrderStatus.CANCELLED;
    default:
      return null;
  }
}

function isUalaPaidStatus(status: UalaWebhookPayload["status"]): boolean {
  return status === "APPROVED" || status === "PROCESSED";
}

/**
 * Impacta el webhook de Ualá de forma idempotente y atómica.
 */
export async function processUalaWebhook(
  payload: UalaWebhookPayload,
  rawPayload: unknown,
): Promise<{ processed: boolean; duplicate?: boolean; reason?: string }> {
  const order = await prisma.order.findUnique({
    where: { id: payload.external_reference },
    include: { payment: true, items: true },
  });

  if (!order?.payment) {
    return { processed: false, reason: "payment_not_found" };
  }

  const payment = order.payment;

  if (
    payment.status === PaymentStatus.APPROVED &&
    isUalaPaidStatus(payload.status)
  ) {
    return { processed: true, duplicate: true };
  }

  const nextPaymentStatus = mapUalaPaymentStatus(payload.status);
  const nextOrderStatus = mapUalaOrderStatus(payload.status);
  const isNewlyApproved = isUalaPaidStatus(payload.status);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: nextPaymentStatus,
        providerPaymentId: payload.uuid,
        rawPayload: rawPayload as Prisma.InputJsonValue,
      },
    });

    if (payload.status === "REJECTED") {
      await releaseProductStock(tx, order.items);
    }

    if (nextOrderStatus) {
      await tx.order.update({
        where: { id: order.id },
        data: { status: nextOrderStatus },
      });
    }
  });

  if (isNewlyApproved) {
    const { sendOrderConfirmationEmail } = await import(
      "@/services/email/send-order-confirmation"
    );
    void sendOrderConfirmationEmail(order.id).catch((error) => {
      console.error("No se pudo enviar email de confirmación:", error);
    });
  }

  return { processed: true };
}
