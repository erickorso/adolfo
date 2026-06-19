import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Storage } from "./storage";

/**
 * Implementación local de `Storage` para desarrollo: guarda en disco bajo
 * `.uploads/`. El acceso se sirve por una ruta autenticada (`/api/files/...`).
 * NO usar en producción (swap por el adapter de nube).
 */
export class LocalStorage implements Storage {
  constructor(private readonly baseDir = path.join(process.cwd(), ".uploads")) {}

  async put(key: string, data: Buffer, _contentType: string): Promise<void> {
    const target = this.resolve(key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolve(key), { force: true });
  }

  async getBytes(key: string): Promise<Buffer> {
    return readFile(this.resolve(key));
  }

  async getSignedUrl(key: string): Promise<string> {
    // En dev no hay firma real: se sirve por una ruta que valida ownership.
    return `/api/files/${key}`;
  }

  /** Resuelve la ruta y previene path traversal fuera de baseDir. */
  private resolve(key: string): string {
    const target = path.resolve(this.baseDir, key);
    const root = path.resolve(this.baseDir);
    if (target !== root && !target.startsWith(root + path.sep)) {
      throw new Error(`Key inválida (path traversal): ${key}`);
    }
    return target;
  }
}
