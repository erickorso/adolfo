"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { updateProduct } from "@/services/admin/product-admin.service";
import { parseAttributesJson } from "@/domain/catalog/product-attributes";
import {
  setUserBanned,
  setUserRole,
} from "@/services/admin/user-admin.service";
import {
  setJobHidden,
  setProductActive,
  setServiceActive,
} from "@/services/admin/moderation.service";
import {
  uploadCatalogImage,
  type CatalogItemType,
} from "@/services/catalog/catalog-image.service";
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

export type UpdateProductResult = { ok?: boolean; error?: string };

const updateProductSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: z.string().trim().optional(),
  priceCents: z.coerce.number().int().nonnegative("Precio inválido"),
  stock: z.coerce.number().int().nonnegative("Stock inválido"),
});

/** Edita un producto: campos básicos + reemplazo de propiedades custom. */
export async function updateProductAction(
  _prev: UpdateProductResult,
  formData: FormData,
): Promise<UpdateProductResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { error: "Falta el identificador del producto." };
  }
  const parsed = updateProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    priceCents: formData.get("priceCents"),
    stock: formData.get("stock"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const attributes = parseAttributesJson(
    String(formData.get("attributes") ?? "[]"),
  );
  await updateProduct(id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    priceCents: parsed.data.priceCents,
    stock: parsed.data.stock,
    attributes,
  });
  revalidatePath("/admin/catalog");
  revalidatePath("/");
  return { ok: true };
}

/** Sube una imagen a un producto/servicio. */
export async function uploadCatalogImageAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const type = String(formData.get("type") ?? "") as CatalogItemType;
  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0 || !id) {
    return;
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  await uploadCatalogImage({
    type,
    id,
    file: { mimeType: file.type, bytes },
  });
  revalidatePath("/admin/catalog");
  revalidatePath("/");
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
