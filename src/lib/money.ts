/**
 * Utilidades de dinero. Toda cantidad monetaria se maneja como ENTEROS en
 * centavos para evitar errores de redondeo de punto flotante.
 * Single source of truth para formateo y aritmética de precios.
 */

export type Money = {
  /** Monto en centavos (entero). */
  readonly cents: number;
  /** Código ISO 4217, ej. "ARS". */
  readonly currency: string;
};

/** Crea un Money validando que el monto sea un entero no negativo. */
export function money(cents: number, currency = "ARS"): Money {
  if (!Number.isInteger(cents)) {
    throw new Error(`El monto debe ser un entero en centavos, recibido: ${cents}`);
  }
  if (cents < 0) {
    throw new Error(`El monto no puede ser negativo, recibido: ${cents}`);
  }
  return { cents, currency };
}

/** Suma una lista de líneas (precio unitario × cantidad) en centavos. */
export function sumLineItemsCents(
  items: ReadonlyArray<{ unitPriceCents: number; quantity: number }>,
): number {
  return items.reduce(
    (total, item) => total + item.unitPriceCents * item.quantity,
    0,
  );
}

/**
 * Formatea centavos a string legible según la moneda y el locale.
 * Ej: formatMoney(150000, "ARS") -> "$ 1.500,00"
 */
export function formatMoney(
  cents: number,
  currency = "ARS",
  locale = "es-AR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/**
 * Convierte un monto en centavos ARS a dólares (float), dada la cotización
 * `sellArs` (ARS por 1 USD). Display-only: el cobro sigue en ARS.
 */
export function arsCentsToUsd(arsCents: number, sellArs: number): number {
  if (sellArs <= 0) {
    return 0;
  }
  return arsCents / 100 / sellArs;
}

/** Formatea un monto en dólares (float) como USD. Ej: 12.5 -> "US$ 12.50" */
export function formatUsd(usd: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(usd);
}
