import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}

const base = env.AUTH_URL;
if (!base) {
  console.error("AUTH_URL no configurada");
  process.exit(1);
}

console.log("Tunnel/app:", base);
const home = await fetch(`${base}/es`);
console.log("GET /es via tunnel:", home.status);

const authRes = await fetch(`${env.UALA_AUTH_URL}/auth/token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: env.UALA_USERNAME,
    client_id: env.UALA_CLIENT_ID,
    client_secret_id: env.UALA_CLIENT_SECRET_ID,
    grant_type: "client_credentials",
  }),
});
if (!authRes.ok) {
  console.error("Auth fail", authRes.status, await authRes.text());
  process.exit(1);
}
const { access_token } = await authRes.json();

const checkoutBody = {
  amount: "50.00",
  description: "Producto prueba Ualá",
  callback_success: `${base}/es/checkout/success`,
  callback_fail: `${base}/es/checkout/fail`,
  notification_url: `${base}/api/webhooks/uala`,
  external_reference: `test-${Date.now()}`,
};

const checkoutRes = await fetch(`${env.UALA_CHECKOUT_URL}/checkout`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
  body: JSON.stringify(checkoutBody),
});
const checkoutText = await checkoutRes.text();
console.log("Ualá checkout:", checkoutRes.status, checkoutText.slice(0, 400));

if (!checkoutRes.ok) process.exit(1);

const data = JSON.parse(checkoutText);
console.log("\nCheckout link:", data.links?.checkout_link);
