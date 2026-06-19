import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/users/user.service";
import { isAdmin, isSuperadmin } from "@/lib/authz";
import type { User } from "@/generated/prisma/client";

/** Exige un admin (o superior). Redirige si no hay sesión o no es admin. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!isAdmin(user.role)) {
    redirect("/");
  }
  return user;
}

/** Exige un SUPERADMIN. */
export async function requireSuperadmin(): Promise<User> {
  const user = await requireAdmin();
  if (!isSuperadmin(user.role)) {
    redirect("/admin");
  }
  return user;
}
