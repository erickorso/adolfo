import "server-only";
import { prisma } from "@/lib/prisma";
import {
  createKitItemSchema,
  updateKitItemSchema,
  type CreateKitItemInput,
  type KitItemDTO,
  type UpdateKitItemInput,
} from "@/domain/kit/schemas";

function toDto(row: {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}): KitItemDTO {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listKitItems(): Promise<KitItemDTO[]> {
  const rows = await prisma.kitItem.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });
  return rows.map(toDto);
}

export async function createKitItem(
  raw: unknown,
): Promise<{ ok: true; item: KitItemDTO } | { ok: false; error: string }> {
  const parsed = createKitItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "inválido" };
  }
  const data: CreateKitItemInput = parsed.data;
  const row = await prisma.kitItem.create({
    data: { title: data.title },
  });
  return { ok: true, item: toDto(row) };
}

export async function updateKitItem(
  id: string,
  raw: unknown,
): Promise<
  { ok: true; item: KitItemDTO } | { ok: false; error: string; status: 400 | 404 }
> {
  const parsed = updateKitItemSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "inválido",
      status: 400,
    };
  }
  const data: UpdateKitItemInput = parsed.data;
  try {
    const row = await prisma.kitItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.done !== undefined ? { done: data.done } : {}),
      },
    });
    return { ok: true, item: toDto(row) };
  } catch {
    return { ok: false, error: "no encontrado", status: 404 };
  }
}

export async function deleteKitItem(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.kitItem.delete({ where: { id } });
    return { ok: true };
  } catch {
    return { ok: false, error: "no encontrado" };
  }
}
