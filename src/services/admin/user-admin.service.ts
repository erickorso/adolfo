import "server-only";
import { prisma } from "@/lib/prisma";
import { canManageRole } from "@/lib/authz";
import type { UserRole } from "@/generated/prisma/client";

type Actor = { id: string; role: UserRole };

/** Lista usuarios (con búsqueda opcional por email/nombre). */
export async function listUsers(search?: string) {
  const term = search?.trim();
  return prisma.user.findMany({
    where: term
      ? {
          OR: [
            { email: { contains: term, mode: "insensitive" } },
            { name: { contains: term, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
    take: 200,
  });
}

/** Cambia el rol de un usuario, validando permisos del actor. */
export async function setUserRole(
  actor: Actor,
  userId: string,
  role: UserRole,
): Promise<void> {
  if (userId === actor.id) {
    throw new Error("No podés cambiar tu propio rol.");
  }
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!target) {
    throw new Error("Usuario no encontrado.");
  }
  // El actor debe poder gestionar tanto el rol actual como el nuevo.
  if (!canManageRole(actor.role, target.role) || !canManageRole(actor.role, role)) {
    throw new Error("No tenés permisos para asignar ese rol.");
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
}

/** Banea o desbanea a un usuario, validando permisos del actor. */
export async function setUserBanned(
  actor: Actor,
  userId: string,
  banned: boolean,
): Promise<void> {
  if (userId === actor.id) {
    throw new Error("No podés banearte a vos mismo.");
  }
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!target) {
    throw new Error("Usuario no encontrado.");
  }
  if (!canManageRole(actor.role, target.role)) {
    throw new Error("No podés moderar a ese usuario.");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      status: banned ? "BANNED" : "ACTIVE",
      bannedAt: banned ? new Date() : null,
    },
  });
}
