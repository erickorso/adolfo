import "server-only";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCurrentUser } from "@/services/users/user.service";
import { isAdmin, isSuperadmin } from "@/lib/authz";
import type { User } from "@/generated/prisma/client";

/** Exige un admin (o superior). Redirige (con locale) si no hay sesión o no es admin. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  const locale = await getLocale();
  if (!user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  }
  if (!isAdmin(user.role)) {
    redirect(`/${locale}`);
  }
  return user;
}

/** Exige un SUPERADMIN. */
export async function requireSuperadmin(): Promise<User> {
  const user = await requireAdmin();
  if (!isSuperadmin(user.role)) {
    const locale = await getLocale();
    redirect(`/${locale}/admin`);
  }
  return user;
}
