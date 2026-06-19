import { describe, expect, it } from "vitest";
import { arsCentsToUsd, formatUsd, money, sumLineItemsCents } from "./money";

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

  it("convierte centavos ARS a USD con la cotización", () => {
    // 1.450.000 centavos = $14.500 ARS; a $1450/USD = 10 USD
    expect(arsCentsToUsd(1450000, 1450)).toBeCloseTo(10, 5);
  });

  it("conversión con tasa inválida (<=0) devuelve 0", () => {
    expect(arsCentsToUsd(1000, 0)).toBe(0);
  });

  it("formatea USD", () => {
    expect(formatUsd(10)).toMatch(/10\.00/);
  });
});
