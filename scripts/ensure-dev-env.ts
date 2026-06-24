/**
 * Agrega variables de dev faltantes a `.env` sin sobrescribir las existentes.
 * Uso: npx tsx scripts/ensure-dev-env.ts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env");
const MOCK_UALA = "http://localhost:9999/v2/api";

const DEV_DEFAULTS: Record<string, string> = {
  AUTH_URL: "http://localhost:3000",
  UALA_AUTH_URL: MOCK_UALA,
  UALA_CHECKOUT_URL: MOCK_UALA,
  UALA_USERNAME: "dev-user",
  UALA_CLIENT_ID: "dev-client",
  UALA_CLIENT_SECRET_ID: "dev-secret",
  EMAIL_PROVIDER: "console",
  EMAIL_FROM: "Catálogo <dev@localhost>",
  STORAGE_DRIVER: "local",
  NEXT_PUBLIC_APP_NAME: "Catálogo",
  EXCHANGE_RATE_TYPE: "tarjeta",
};

function parseKeys(content: string): Set<string> {
  const keys = new Set<string>();
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      keys.add(match[1]);
    }
  }
  return keys;
}

function main(): void {
  if (!existsSync(ENV_PATH)) {
    console.error("No existe .env. Copiá .env.example y completá DATABASE_URL + AUTH_SECRET.");
    process.exit(1);
  }

  const content = readFileSync(ENV_PATH, "utf8");
  const existing = parseKeys(content);
  const missing = Object.entries(DEV_DEFAULTS).filter(([key]) => !existing.has(key));

  if (missing.length === 0) {
    console.log(".env ya tiene todas las variables de dev.");
    return;
  }

  const block = [
    "",
    "# ── Dev local (mock Ualá v2 en :9999 — npm run dev:full) ──",
    ...missing.map(([key, value]) => `${key}="${value}"`),
    "",
  ].join("\n");

  writeFileSync(ENV_PATH, content.trimEnd() + block);
  console.log(`Agregadas ${missing.length} variables: ${missing.map(([k]) => k).join(", ")}`);
}

main();
