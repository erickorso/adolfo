import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

/**
 * Usuario actual (o null si no hay sesión).
 *
 * Con Auth.js + adapter de Prisma, el usuario ya vive en nuestra DB; la sesión
 * trae su id. No hay sync con un servicio externo: leemos la fila local.
 * Útil en Server Components / Server Actions para resolver el `userId`.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return prisma.user.findUnique({ where: { id: session.user.id } });
}
