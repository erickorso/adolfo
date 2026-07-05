import type { DemoExchangeRatesResponse } from "@/domain/demo/public-api.types";
import { getCached, setCached } from "@/lib/demo/public-api-cache";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";

const SOURCE = "open.er-api.com";
const CACHE_TTL_MS = 60 * 60 * 1000;

type OpenErApiResponse = {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
};

export async function getDemoExchangeRates(
  base: string,
): Promise<DemoExchangeRatesResponse> {
  const normalizedBase = base.toUpperCase();
  const cacheKey = `exchange-rates:${normalizedBase}`;
  const cached = getCached<DemoExchangeRatesResponse>(cacheKey);
  if (cached) {
    return { ...cached, meta: { ...cached.meta, cached: true } };
  }

  const payload = await fetchPublicJson<OpenErApiResponse>(
    `https://open.er-api.com/v6/latest/${encodeURIComponent(normalizedBase)}`,
  );

  if (payload.result !== "success") {
    throw new Error("Exchange rate provider returned an error");
  }

  const response: DemoExchangeRatesResponse = {
    base: payload.base_code,
    date: payload.time_last_update_utc.slice(0, 10),
    rates: payload.rates,
    meta: {
      source: SOURCE,
      cached: false,
      updatedAt: payload.time_last_update_utc,
    },
  };

  setCached(cacheKey, response, CACHE_TTL_MS);
  return response;
}
