import { formatMoney } from "@/lib/money";

export type OrderConfirmationInput = {
  orderId: string;
  customerName: string | null;
  customerEmail: string;
  totalCents: number;
  currency: string;
  items: ReadonlyArray<{
    name: string;
    quantity: number;
    unitPriceCents: number;
  }>;
};

export function buildOrderConfirmationEmail(input: OrderConfirmationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = input.customerName
    ? `Hola ${input.customerName},`
    : "Hola,";
  const total = formatMoney(input.totalCents, input.currency);
  const lines = input.items
    .map(
      (item) =>
        `- ${item.name} × ${item.quantity}: ${formatMoney(item.unitPriceCents * item.quantity, input.currency)}`,
    )
    .join("\n");

  const subject = `Confirmación de pedido #${input.orderId.slice(-8)}`;
  const text = `${greeting}

Recibimos tu pago. Resumen del pedido:

${lines}

Total: ${total}

Gracias por tu compra.`;

  const html = `
    <p>${greeting}</p>
    <p>Recibimos tu pago. Resumen del pedido:</p>
    <ul>
      ${input.items
        .map(
          (item) =>
            `<li>${item.name} × ${item.quantity}: ${formatMoney(item.unitPriceCents * item.quantity, input.currency)}</li>`,
        )
        .join("")}
    </ul>
    <p><strong>Total: ${total}</strong></p>
    <p>Gracias por tu compra.</p>
  `.trim();

  return { subject, html, text };
}
