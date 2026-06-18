/** Contratos de la integración con Ualá Bis. Aislados del cliente HTTP. */

export type CreateChargeInput = {
  /** Monto total en centavos. */
  amountCents: number;
  currency: string;
  /** ID interno del pedido para reconciliar. */
  orderId: string;
  /** Clave de idempotencia que viajará y volverá en el webhook. */
  idempotencyKey: string;
  /** URL a la que Ualá redirige al finalizar. */
  returnUrl: string;
  description?: string;
};

export type CreateChargeResult = {
  /** ID del cobro del lado de Ualá. */
  paymentId: string;
  /** URL de checkout a la que redirigir al comprador. */
  checkoutUrl: string;
};
