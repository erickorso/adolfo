import type { DemoCountry, DemoCountriesResponse } from "@/domain/demo/public-api.types";
import { getCached, setCached } from "@/lib/demo/public-api-cache";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";

const SOURCE = "countriesnow.space";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CountriesNowCountry = {
  Iso2?: string;
  Iso3?: string;
  iso2?: string;
  iso3?: string;
  country: string;
};

type CountriesNowListResponse = {
  error: boolean;
  msg: string;
  data: CountriesNowCountry[];
};

function normalizeCountry(row: CountriesNowCountry): DemoCountry {
  return {
    iso2: (row.Iso2 ?? row.iso2 ?? "").toUpperCase(),
    iso3: (row.Iso3 ?? row.iso3 ?? "").toUpperCase(),
    name: row.country,
  };
}

async function loadAllCountries(): Promise<DemoCountry[]> {
  const cacheKey = "countries:all:v2";
  const cached = getCached<DemoCountry[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const payload = await fetchPublicJson<CountriesNowListResponse>(
    "https://countriesnow.space/api/v0.1/countries",
  );

  if (payload.error || !Array.isArray(payload.data)) {
    throw new Error("Countries provider returned an error");
  }

  const countries = payload.data.map(normalizeCountry).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  setCached(cacheKey, countries, CACHE_TTL_MS);
  return countries;
}

export async function getDemoCountries(options: {
  query?: string;
  code?: string;
  limit: number;
}): Promise<DemoCountriesResponse> {
  const all = await loadAllCountries();
  const cached = getCached<DemoCountry[]>("countries:all:v2") !== null;

  let filtered = all;

  if (options.code) {
    const code = options.code.toUpperCase();
    filtered = all.filter(
      (country) => country.iso2 === code || country.iso3 === code,
    );
  } else if (options.query) {
    const q = options.query.toLowerCase();
    filtered = all.filter((country) => country.name.toLowerCase().includes(q));
  }

  const countries = filtered.slice(0, options.limit);

  return {
    countries,
    total: filtered.length,
    meta: {
      source: SOURCE,
      cached,
    },
  };
}
