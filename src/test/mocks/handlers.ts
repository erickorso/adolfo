import { http, HttpResponse } from "msw";

let mockCartItems: unknown[] = [];

/** MSW: mock Ualá Bis API Cobros Online v2. */
export const handlers = [
  http.post("*/v2/api/auth/token", () =>
    HttpResponse.json({ access_token: "test-token", expires_in: 3600 }),
  ),

  http.post("*/v2/api/checkout", () =>
    HttpResponse.json({
      uuid: "uala-order-test-123",
      amount: 1000,
      status: "PENDING",
      external_reference: "ord_test",
      links: {
        checkout_link: "https://checkout.uala.test/orders/test",
        success: "http://localhost:3000/es/checkout/success",
        failed: "http://localhost:3000/es/checkout/fail",
      },
    }),
  ),

  http.get("/api/cart", () => HttpResponse.json({ items: mockCartItems })),

  http.post("/api/cart", async ({ request }) => {
    const body = (await request.json()) as { items?: unknown[] };
    mockCartItems = Array.isArray(body.items) ? body.items : [];
    return HttpResponse.json({ ok: true });
  }),

  http.post("/api/cart/add", () => HttpResponse.redirect("/", 303)),
];

export function resetMockCart(items: unknown[] = []): void {
  mockCartItems = items;
}
