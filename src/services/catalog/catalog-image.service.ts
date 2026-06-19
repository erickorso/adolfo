import "server-only";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { assertValidImage, imageExt } from "./image.policy";

export type CatalogItemType = "product" | "service";

/**
 * Sube una imagen de catálogo (pública) y la asocia al producto/servicio.
 * Guarda bajo `catalog/<type>/<id>/...` y setea `imageUrl` a la ruta pública.
 */
export async function uploadCatalogImage(input: {
  type: CatalogItemType;
  id: string;
  file: { mimeType: string; bytes: Buffer };
}): Promise<string> {
  const sizeBytes = input.file.bytes.byteLength;
  assertValidImage({ mimeType: input.file.mimeType, sizeBytes });

  const key = `catalog/${input.type}/${input.id}/${randomUUID()}.${imageExt(
    input.file.mimeType,
  )}`;
  await storage.put(key, input.file.bytes, input.file.mimeType);
  const imageUrl = `/api/images/${key}`;

  if (input.type === "product") {
    await prisma.product.update({ where: { id: input.id }, data: { imageUrl } });
  } else {
    await prisma.service.update({ where: { id: input.id }, data: { imageUrl } });
  }

  return imageUrl;
}
