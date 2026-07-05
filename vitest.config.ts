import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const sharedResolve = {
  alias: {
    "@/i18n/navigation": fileURLToPath(
      new URL("./src/test/i18n-navigation.stub.tsx", import.meta.url),
    ),
    "@": fileURLToPath(new URL("./src", import.meta.url)),
    "server-only": fileURLToPath(
      new URL("./src/test/server-only.stub.ts", import.meta.url),
    ),
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: sharedResolve,
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "app",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          css: false,
        },
      },
      {
        extends: true,
        test: {
          name: "backend",
          include: ["backend/src/**/*.test.ts"],
          environment: "node",
          css: false,
        },
      },
    ],
  },
});
