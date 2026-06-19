/** Contratos de cotización de moneda. Independientes del proveedor. */

/** Tipos de dólar soportados (dolarapi). */
export type RateType = "tarjeta" | "oficial" | "blue" | "mep";

/** Cotización normalizada que devuelve un proveedor (ARS por 1 USD). */
export type NormalizedRate = {
  type: RateType;
  buyArs: number;
  sellArs: number;
};

/** Cotización para la UI (snapshot mínimo). */
export type RateVM = {
  type: RateType;
  /** ARS por 1 USD (venta) — usada para convertir precios. */
  sellArs: number;
};

/**
 * Abstracción de proveedor de cotización. Cada fuente (dolarapi, etc.)
 * implementa esta interfaz. Misma idea que JobSource/Storage/AiProvider.
 */
export interface ExchangeRateProvider {
  readonly name: string;
  /** Trae las cotizaciones normalizadas (ARS por USD). */
  fetchRates(): Promise<NormalizedRate[]>;
}
