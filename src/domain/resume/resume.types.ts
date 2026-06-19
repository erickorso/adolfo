/** View model de un CV para la UI (sin exponer storageKey ni el texto crudo). */
export type ResumeVM = {
  id: string;
  label: string;
  mimeType: string;
  sizeBytes: number;
  isDefault: boolean;
  /** Si se pudo extraer texto para la IA. */
  hasText: boolean;
  createdAt: Date;
};

/** Archivo entrante ya leído a memoria, listo para validar y guardar. */
export type IncomingFile = {
  originalName: string;
  mimeType: string;
  bytes: Buffer;
};
