import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UalaService } from "./uala.service";

describe("UalaService v2", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        if (String(url).endsWith("/v2/api/auth/token")) {
          return new Response(
            JSON.stringify({ access_token: "token-a", expires_in: 3600 }),
            { status: 200 },
          );
        }
        if (String(url).endsWith("/v2/api/checkout")) {
          const body = JSON.parse(String(init?.body)) as {
            amount: string;
            external_reference: string;
          };
          expect(body.external_reference).toMatch(/^ord_/);
          return new Response(
            JSON.stringify({
              uuid: "pay-uuid-1",
              amount: 1000,
              status: "PENDING",
              external_reference: "ord_1",
              links: {
                checkout_link: "https://checkout.uala.test/orders/pay-uuid-1",
                success: "http://localhost/success",
                failed: "http://localhost/fail",
              },
            }),
            { status: 200 },
          );
        }
        return new Response("not found", { status: 404 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("cachea el token y crea orden con payload v2", async () => {
    const service = new UalaService({
      authUrl: "https://auth.test/v2/api",
      checkoutUrl: "https://checkout.test/v2/api",
      username: "user",
      clientId: "id",
      clientSecretId: "secret",
    });

    await service.createOrder({
      amountCents: 1000,
      orderId: "ord_1",
      description: "Test",
      callbackSuccess: "http://localhost/success",
      callbackFail: "http://localhost/fail",
      notificationUrl: "http://localhost/api/webhooks/uala",
    });
    await service.createOrder({
      amountCents: 2000,
      orderId: "ord_2",
      description: "Test 2",
      callbackSuccess: "http://localhost/success",
      callbackFail: "http://localhost/fail",
      notificationUrl: "http://localhost/api/webhooks/uala",
    });

    const fetchMock = vi.mocked(fetch);
    const tokenCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/v2/api/auth/token"),
    );
    expect(tokenCalls).toHaveLength(1);
  });
});
