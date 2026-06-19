/**
 * Reglas de negocio de CVs. Funciones puras (sin DB ni IO) para poder testearlas
 * de forma aislada y reutilizarlas en servicio, action y UI.
 */

/** Máximo de CVs por usuario. */
export const MAX_RESUMES = 3;

/** Tamaño máximo de archivo (5 MB). */
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Tipos MIME permitidos: PDF y DOCX. */
export const ALLOWED_RESUME_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export class ResumeLimitError extends Error {
  constructor() {
    super(`Alcanzaste el máximo de ${MAX_RESUMES} CVs.`);
    this.name = "ResumeLimitError";
  }
}

export class InvalidResumeFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidResumeFileError";
  }
}

/** Lanza si el usuario ya alcanzó el límite de CVs. */
export function assertCanAddResume(currentCount: number): void {
  if (currentCount >= MAX_RESUMES) {
    throw new ResumeLimitError();
  }
}

/** Valida tipo y tamaño del archivo entrante. */
export function assertValidResumeFile(file: {
  mimeType: string;
  sizeBytes: number;
}): void {
  if (!ALLOWED_RESUME_MIME.includes(file.mimeType as never)) {
    throw new InvalidResumeFileError(
      "Formato no soportado. Subí un PDF o DOCX.",
    );
  }
  if (file.sizeBytes <= 0) {
    throw new InvalidResumeFileError("El archivo está vacío.");
  }
  if (file.sizeBytes > MAX_RESUME_BYTES) {
    throw new InvalidResumeFileError("El archivo supera los 5 MB.");
  }
}

/** True si el MIME corresponde a un PDF (del que sí extraemos texto). */
export function isPdf(mimeType: string): boolean {
  return mimeType === "application/pdf";
}
