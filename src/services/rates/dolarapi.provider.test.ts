import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { DolarApiProvider } from "./dolarapi.provider";

const URL = "https://dolarapi.com/v1/dolares";

describe("DolarApiProvider", () => {
  it("mapea las casas a nuestros tipos y descarta las desconocidas", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json([
          { casa: "oficial", compra: 900, venta: 950 },
          { casa: "tarjeta", compra: 1400, venta: 1450 },
          { casa: "blue", compra: 1100, venta: 1150 },
          { casa: "bolsa", compra: 1200, venta: 1250 },
          { casa: "cripto", compra: 1300, venta: 1350 },
        ]),
      ),
    );

    const rates = await new DolarApiProvider().fetchRates();
    const byType = Object.fromEntries(rates.map((r) => [r.type, r]));

    expect(byType.tarjeta).toMatchObject({ sellArs: 1450, buyArs: 1400 });
    expect(byType.mep).toMatchObject({ sellArs: 1250 }); // "bolsa" -> mep
    expect(byType.oficial.sellArs).toBe(950);
    // "cripto" no está mapeado -> se descarta
    expect(rates).toHaveLength(4);
  });

  it("descarta items con venta/compra nulas", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json([{ casa: "tarjeta", compra: null, venta: null }]),
      ),
    );
    const rates = await new DolarApiProvider().fetchRates();
    expect(rates).toHaveLength(0);
  });

  it("lanza ante error HTTP", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(new DolarApiProvider().fetchRates()).rejects.toThrow();
  });
});
