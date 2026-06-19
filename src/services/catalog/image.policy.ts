/**
 * Reglas de imágenes de catálogo. Funciones puras (sin IO) → testeables.
 * Imágenes PÚBLICAS (a diferencia de los CVs, que son privados/PII).
 */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidImageError";
  }
}

/** Valida tipo y tamaño de la imagen entrante. */
export function assertValidImage(file: {
  mimeType: string;
  sizeBytes: number;
}): void {
  if (!ALLOWED_IMAGE_MIME.includes(file.mimeType as never)) {
    throw new InvalidImageError("Formato no soportado. Subí JPEG, PNG o WebP.");
  }
  if (file.sizeBytes <= 0) {
    throw new InvalidImageError("El archivo está vacío.");
  }
  if (file.sizeBytes > MAX_IMAGE_BYTES) {
    throw new InvalidImageError("La imagen supera los 2 MB.");
  }
}

/** Extensión de archivo según el MIME. */
export function imageExt(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}
