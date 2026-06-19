import type {
  ExchangeRateProvider,
  NormalizedRate,
  RateType,
} from "@/domain/money/rate.types";

const URL = "https://dolarapi.com/v1/dolares";

/** `casa` de dolarapi -> nuestro RateType. */
const CASA_TO_TYPE: Record<string, RateType> = {
  tarjeta: "tarjeta",
  oficial: "oficial",
  blue: "blue",
  bolsa: "mep",
};

type DolarApiItem = {
  casa: string;
  compra: number | null;
  venta: number | null;
};

/**
 * Proveedor de cotización basado en dolarapi.com (público, sin API key).
 * Devuelve compra/venta en ARS por 1 USD. Usamos `venta` (sellArs) para mostrar
 * el "costo real" del dólar tarjeta — lo más fiel a lo que descuentan.
 */
export class DolarApiProvider implements ExchangeRateProvider {
  readonly name = "dolarapi";

  async fetchRates(): Promise<NormalizedRate[]> {
    const res = await fetch(URL, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`dolarapi respondió ${res.status}`);
    }
    const data = (await res.json()) as DolarApiItem[];

    const rates: NormalizedRate[] = [];
    for (const item of data) {
      const type = CASA_TO_TYPE[item.casa];
      if (type && item.venta != null && item.compra != null) {
        rates.push({ type, buyArs: item.compra, sellArs: item.venta });
      }
    }
    return rates;
  }
}
