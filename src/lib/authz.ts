import type { UserRole } from "@/generated/prisma/client";

/**
 * Reglas de autorización por rol. Funciones puras (sin IO) → testeables.
 * Jerarquía: CUSTOMER < ADMIN < SUPERADMIN.
 */
const RANK: Record<UserRole, number> = {
  CUSTOMER: 0,
  ADMIN: 1,
  SUPERADMIN: 2,
};

export function roleAtLeast(role: UserRole, min: UserRole): boolean {
  return RANK[role] >= RANK[min];
}

export function isAdmin(role: UserRole): boolean {
  return roleAtLeast(role, "ADMIN");
}

export function isSuperadmin(role: UserRole): boolean {
  return role === "SUPERADMIN";
}

/**
 * ¿Puede `actor` gestionar (banear / cambiar rol) a un usuario con rol `target`?
 * SUPERADMIN gestiona a todos; ADMIN solo gestiona CUSTOMERs (no a otros admins).
 */
export function canManageRole(actor: UserRole, target: UserRole): boolean {
  if (actor === "SUPERADMIN") {
    return true;
  }
  if (actor === "ADMIN") {
    return target === "CUSTOMER";
  }
  return false;
}
