/** Contratos Ualá Bis API Cobros Online v2. */

export type CreateUalaOrderInput = {
  /** Monto total en centavos (se convierte a string decimal ARS). */
  amountCents: number;
  /** ID interno del pedido → `external_reference`. */
  orderId: string;
  description: string;
  callbackSuccess: string;
  callbackFail: string;
  /** Webhook POST de estado (notification_url). */
  notificationUrl: string;
};

export type CreateUalaOrderResult = {
  /** UUID de la orden en Ualá. */
  orderUuid: string;
  checkoutUrl: string;
};

/** Respuesta de POST /checkout (v2). */
export type UalaCheckoutResponse = {
  uuid: string;
  amount: number;
  status: string;
  external_reference: string;
  links: {
    checkout_link: string;
    success: string;
    failed: string;
  };
};
