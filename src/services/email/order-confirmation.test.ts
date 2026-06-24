import { describe, expect, it } from "vitest";
import { buildOrderConfirmationEmail } from "./order-confirmation";

describe("buildOrderConfirmationEmail", () => {
  it("arma subject y cuerpo con el resumen del pedido", () => {
    const { subject, text, html } = buildOrderConfirmationEmail({
      orderId: "clorder123456789",
      customerName: "Ada",
      customerEmail: "ada@test.local",
      totalCents: 1500000,
      currency: "ARS",
      items: [
        { name: "Remera básica", quantity: 1, unitPriceCents: 1500000 },
      ],
    });

    expect(subject).toContain("23456789");
    expect(text).toContain("Hola Ada");
    expect(text).toContain("Remera básica");
    expect(html).toContain("15.000,00");
  });
});
