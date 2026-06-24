import { defineConfig, devices } from "@playwright/test";

const e2eEnv = {
  SKIP_ENV_VALIDATION: "true",
  EXCHANGE_RATE_TYPE: "tarjeta",
  AI_PROVIDER: "gemini",
  UALA_AUTH_URL: "http://localhost:9999/v2/api",
  UALA_CHECKOUT_URL: "http://localhost:9999/v2/api",
  UALA_USERNAME: "e2e-user",
  UALA_CLIENT_ID: "e2e-client",
  UALA_CLIENT_SECRET_ID: "e2e-secret",
  AUTH_URL: "http://localhost:3000",
  EMAIL_PROVIDER: "console",
  STORAGE_DRIVER: "local",
};

/**
 * Configuración E2E (Playwright).
 * Levanta mock de Ualá + Next dev con credenciales de prueba.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npx tsx e2e/mock-uala-server.ts",
      port: 9999,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: process.env.CI ? "npm run start" : "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        ...e2eEnv,
      },
    },
  ],
});
