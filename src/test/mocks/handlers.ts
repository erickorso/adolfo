import { http, HttpResponse } from "msw";

/**
 * Handlers de MSW: interceptan llamadas HTTP en los tests.
 * Acá mockeamos la API de Ualá Bis para no pegarle a la red real.
 * El base URL coincide con UALA_API_BASE_URL del entorno de test.
 */
export const handlers = [
  // OAuth token
  http.post("*/oauth/token", () =>
    HttpResponse.json({ access_token: "test-token", expires_in: 3600 }),
  ),

  // Crear cobro
  http.post("*/v1/charges", () =>
    HttpResponse.json({
      id: "uala_charge_test_123",
      checkout_url: "https://checkout.uala.test/pay/uala_charge_test_123",
    }),
  ),
];
