import { execSync } from "node:child_process";
import type { FullConfig } from "@playwright/test";

/** Prepara la DB antes de los tests E2E (subprocess para evitar conflictos ESM). */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  execSync("npm run prisma:generate", {
    stdio: "inherit",
    env: process.env,
  });
  execSync("npx tsx e2e/seed-e2e.ts", {
    stdio: "inherit",
    env: process.env,
  });
}
