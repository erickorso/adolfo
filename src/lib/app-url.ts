import { env } from "@/lib/env";

/**
 * URL pública base de la app (return URLs, links absolutos, Ualá callbacks).
 *
 * Prioridad:
 * 1. AUTH_URL (dominio propio o override manual)
 * 2. VERCEL_URL (deploy en *.vercel.app sin dominio)
 * 3. localhost (dev)
 */
export function getAppBaseUrl(): string {
  if (env.AUTH_URL) {
    return env.AUTH_URL.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}
