import "server-only";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

/**
 * Sincronización Auth0 -> DB local.
 *
 * ESTRATEGIA (lazy sync en el primer request autenticado):
 * Auth0 es la fuente de verdad de la identidad. No copiamos el user a ningún
 * store de cliente. En cambio, la primera vez que un usuario autenticado toca
 * el backend, hacemos un `upsert` por `auth0Id` (el claim `sub`) para tener una
 * fila local a la cual colgar pedidos y relaciones.
 *
 * Esto evita webhooks de Auth0 o post-login hooks: es idempotente y se
 * autorrepara si el user cambia su email/nombre en Auth0.
 */
export async function syncUserFromSession(): Promise<User | null> {
  const session = await auth0.getSession();
  const claims = session?.user;

  if (!claims?.sub || !claims.email) {
    return null;
  }

  return prisma.user.upsert({
    where: { auth0Id: claims.sub },
    create: {
      auth0Id: claims.sub,
      email: claims.email,
      name: claims.name ?? null,
      picture: claims.picture ?? null,
    },
    update: {
      email: claims.email,
      name: claims.name ?? null,
      picture: claims.picture ?? null,
    },
  });
}

/**
 * Devuelve el usuario local del request actual (o null si no hay sesión).
 * Útil en Server Components / Server Actions para resolver `userId`.
 */
export async function getCurrentDbUser(): Promise<User | null> {
  return syncUserFromSession();
}
