import type { DemoCitiesResponse } from "@/domain/demo/public-api.types";
import { getCached, setCached } from "@/lib/demo/public-api-cache";
import { postPublicJson } from "@/services/demo/public-api-fetch";

const SOURCE = "countriesnow.space";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CitiesResponse = {
  error: boolean;
  msg: string;
  data: string[];
};

export async function getDemoCities(
  country: string,
  limit: number,
): Promise<DemoCitiesResponse> {
  const cacheKey = `cities:${country.toLowerCase()}:${limit}`;
  const cached = getCached<DemoCitiesResponse>(cacheKey);
  if (cached) {
    return { ...cached, meta: { ...cached.meta, cached: true } };
  }

  const payload = await postPublicJson<CitiesResponse>(
    "https://countriesnow.space/api/v0.1/countries/cities",
    { country },
  );

  if (payload.error || !Array.isArray(payload.data)) {
    throw new Error(`No cities found for country "${country}"`);
  }

  const response: DemoCitiesResponse = {
    country,
    cities: payload.data.slice(0, limit),
    total: payload.data.length,
    meta: {
      source: SOURCE,
      cached: false,
      limit,
    },
  };

  setCached(cacheKey, response, CACHE_TTL_MS);
  return response;
}
