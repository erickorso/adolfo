export type DemoCountry = {
  iso2: string;
  iso3: string;
  name: string;
};

export type DemoExchangeRatesResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
  meta: {
    source: string;
    cached: boolean;
    updatedAt: string;
  };
};

export type DemoCountriesResponse = {
  countries: DemoCountry[];
  total: number;
  meta: {
    source: string;
    cached: boolean;
  };
};

export type DemoCitiesResponse = {
  country: string;
  cities: string[];
  total: number;
  meta: {
    source: string;
    cached: boolean;
    limit: number;
  };
};
