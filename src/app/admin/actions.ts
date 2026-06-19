"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import {
  setUserBanned,
  setUserRole,
} from "@/services/admin/user-admin.service";
import {
  setJobHidden,
  setProductActive,
  setServiceActive,
} from "@/services/admin/moderation.service";
import type { UserRole } from "@/generated/prisma/client";

/** Banea / desbanea un usuario. */
export async function banUserAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  await setUserBanned(
    { id: admin.id, role: admin.role },
    String(formData.get("userId") ?? ""),
    formData.get("banned") === "true",
  );
  revalidatePath("/admin/users");
}

/** Cambia el rol de un usuario (la jerarquía la valida el servicio). */
export async function setRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  await setUserRole(
    { id: admin.id, role: admin.role },
    String(formData.get("userId") ?? ""),
    String(formData.get("role") ?? "") as UserRole,
  );
  revalidatePath("/admin/users");
}

/** Activa / desactiva un producto. */
export async function setProductActiveAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  await setProductActive(
    String(formData.get("id") ?? ""),
    formData.get("active") === "true",
  );
  revalidatePath("/admin/catalog");
}

/** Activa / desactiva un servicio. */
export async function setServiceActiveAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  await setServiceActive(
    String(formData.get("id") ?? ""),
    formData.get("active") === "true",
  );
  revalidatePath("/admin/catalog");
}

/** Oculta / muestra una vacante. */
export async function setJobHiddenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await setJobHidden(
    String(formData.get("id") ?? ""),
    formData.get("hidden") === "true",
  );
  revalidatePath("/admin/jobs");
}
