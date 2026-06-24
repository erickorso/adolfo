import "server-only";
import { del, get, put } from "@vercel/blob";
import type { Storage } from "./storage";

/** Storage en Vercel Blob (ideal para deploy sin S3 externo). */
export class BlobStorage implements Storage {
  async put(key: string, data: Buffer, contentType: string): Promise<void> {
    await put(key, data, {
      access: "private",
      contentType,
      addRandomSuffix: false,
    });
  }

  async delete(key: string): Promise<void> {
    await del(key);
  }

  async getBytes(key: string): Promise<Buffer> {
    const result = await get(key, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error(`Objeto vacío o inexistente: ${key}`);
    }
    const bytes = await new Response(result.stream).arrayBuffer();
    return Buffer.from(bytes);
  }

  async getSignedUrl(key: string): Promise<string> {
    // CVs e imágenes se sirven vía rutas autenticadas de la app, no URL directa.
    return `/api/images/${key}`;
  }
}
