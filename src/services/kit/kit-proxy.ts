import "server-only";

/**
 * Si `KIT_API_URL` está definido, el BFF Next reenvía al microservicio Fastify.
 * Si no, usa Prisma/Neon (default prod Vercel).
 */
export function getKitApiBaseUrl(): string | null {
  const raw = process.env.KIT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export async function proxyToKitApi(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const base = getKitApiBaseUrl();
  if (!base) {
    throw new Error("KIT_API_URL no configurado");
  }
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
}
