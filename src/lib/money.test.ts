import { describe, expect, it } from "vitest";
import { money, sumLineItemsCents } from "./money";

describe("money", () => {
  it("crea un Money válido", () => {
    expect(money(1500, "ARS")).toEqual({ cents: 1500, currency: "ARS" });
  });

  it("rechaza montos no enteros (evita errores de float)", () => {
    expect(() => money(15.5)).toThrow();
  });

  it("rechaza montos negativos", () => {
    expect(() => money(-1)).toThrow();
  });

  it("suma líneas precio × cantidad en centavos", () => {
    const total = sumLineItemsCents([
      { unitPriceCents: 1000, quantity: 2 },
      { unitPriceCents: 500, quantity: 3 },
    ]);
    expect(total).toBe(3500);
  });
});
