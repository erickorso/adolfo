/**
 * Abstracción de almacenamiento de objetos (archivos/imágenes).
 *
 * La app depende de esta interfaz, no de un proveedor concreto. Hoy: impl local
 * para dev. Mañana: Supabase Storage / Cloudflare R2 / S3, sin tocar el resto
 * (mismo patrón que JobSource). Los CVs son PII → bucket privado + URLs firmadas.
 */
export interface Storage {
  /** Guarda un objeto bajo `key`. */
  put(key: string, data: Buffer, contentType: string): Promise<void>;
  /** Elimina un objeto. No falla si no existe. */
  delete(key: string): Promise<void>;
  /** Lee el contenido crudo de un objeto. */
  getBytes(key: string): Promise<Buffer>;
  /**
   * Devuelve una URL temporal para acceder al objeto (privado).
   * En prod sería una signed URL del proveedor; en dev, una ruta autenticada.
   */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
