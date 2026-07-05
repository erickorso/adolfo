import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/services/demo/public-api-fetch", () => ({
  fetchPublicJson: vi.fn(),
  postPublicJson: vi.fn(),
}));

import { fetchPublicJson, postPublicJson } from "@/services/demo/public-api-fetch";
import { getDemoExchangeRates } from "@/services/demo/exchange-rates.provider";
import { getDemoCountries } from "@/services/demo/countries.provider";
import { getDemoCities } from "@/services/demo/cities.provider";
import { clearPublicApiCache } from "@/lib/demo/public-api-cache";

describe("demo public API providers", () => {
  beforeEach(() => {
    clearPublicApiCache();
    vi.mocked(fetchPublicJson).mockReset();
    vi.mocked(postPublicJson).mockReset();
  });

  it("normaliza tipos de cambio USD", async () => {
    vi.mocked(fetchPublicJson).mockResolvedValue({
      result: "success",
      base_code: "USD",
      time_last_update_utc: "Sun, 05 Jul 2026 00:02:31 +0000",
      rates: { EUR: 0.92, GBP: 0.79 },
    });

    const result = await getDemoExchangeRates("usd");

    expect(result.base).toBe("USD");
    expect(result.rates.EUR).toBe(0.92);
    expect(result.meta.source).toBe("open.er-api.com");
  });

    it("filtra países por código ISO2", async () => {
    vi.mocked(fetchPublicJson).mockResolvedValue({
      error: false,
      msg: "ok",
      data: [
        { iso2: "ES", iso3: "ESP", country: "Spain" },
        { iso2: "AR", iso3: "ARG", country: "Argentina" },
      ],
    });

    const result = await getDemoCountries({ code: "ES", limit: 10 });

    expect(result.countries).toEqual([
      { iso2: "ES", iso3: "ESP", name: "Spain" },
    ]);
    expect(result.total).toBe(1);
  });

  it("pagina ciudades por país", async () => {
    vi.mocked(postPublicJson).mockResolvedValue({
      error: false,
      msg: "ok",
      data: ["Madrid", "Barcelona", "Valencia"],
    });

    const result = await getDemoCities("Spain", 2);

    expect(result.cities).toEqual(["Madrid", "Barcelona"]);
    expect(result.total).toBe(3);
    expect(result.meta.limit).toBe(2);
  });
});
