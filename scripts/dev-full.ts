/**
 * Levanta mock de Ualá (:9999) + Next dev (:3000) para desarrollo con checkout.
 */
import { spawn } from "node:child_process";

const root = process.cwd();

function run(
  label: string,
  command: string,
  args: string[],
): ReturnType<typeof spawn> {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${label}] salió con código ${code}`);
      process.exit(code ?? 1);
    }
  });
  return child;
}

console.log("→ Mock Ualá: http://localhost:9999");
console.log("→ Next.js:   http://localhost:3000\n");

const mock = run("mock-uala", "npx", ["tsx", "e2e/mock-uala-server.ts"]);
const next = run("next", "npm", ["run", "dev"]);

function shutdown(): void {
  mock.kill();
  next.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
