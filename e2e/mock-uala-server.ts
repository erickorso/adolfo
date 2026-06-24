import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_UALA_PORT ?? 9999);
const BASE = "/v2/api";
const APP_ORIGIN = process.env.E2E_APP_ORIGIN ?? "http://localhost:3000";
const LOCALE = process.env.E2E_LOCALE ?? "es";

function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk as Buffer));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/** Mock Ualá Bis API v2 (auth + checkout) para dev/E2E. */
const server = createServer(async (req, res) => {
  const url = req.url ?? "";

  if (req.method === "POST" && url.endsWith(`${BASE}/auth/token`)) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ access_token: "e2e-token", expires_in: 3600 }));
    return;
  }

  if (req.method === "POST" && url.endsWith(`${BASE}/checkout`)) {
    let orderId = "mock-order";
    try {
      const body = JSON.parse(await readBody(req)) as {
        external_reference?: string;
      };
      if (body.external_reference) {
        orderId = body.external_reference;
      }
    } catch {
      /* fallback */
    }

    const payUrl = new URL("/api/dev/mock-uala-pay", APP_ORIGIN);
    payUrl.searchParams.set("orderId", orderId);
    payUrl.searchParams.set("locale", LOCALE);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        uuid: "e2e-order-uuid-123",
        amount: 5000,
        status: "PENDING",
        external_reference: orderId,
        links: {
          checkout_link: payUrl.toString(),
          success: `${APP_ORIGIN}/${LOCALE}/checkout/success`,
          failed: `${APP_ORIGIN}/${LOCALE}/checkout/fail`,
        },
      }),
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log(`Mock Ualá v2 en http://localhost:${PORT}${BASE}`);
});
