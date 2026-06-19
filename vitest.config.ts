import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` lanza fuera de RSC; en tests lo neutralizamos.
      "server-only": fileURLToPath(
        new URL("./src/test/server-only.stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Los tests E2E de Playwright viven en /e2e y se corren por separado.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
});
