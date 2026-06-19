/**
 * Contratos del módulo de empleos. Independientes de Prisma y de cualquier
 * fuente concreta, para que la lógica y la UI dependan de abstracciones (SOLID).
 */

/** Vacante ya normalizada que devuelve un adapter, antes de persistir. */
export type NormalizedJob = {
  /** Identificador de la fuente, ej. "greenhouse". */
  source: string;
  /** ID de la vacante dentro de la fuente. */
  externalId: string;
  company: string;
  title: string;
  location: string | null;
  remote: boolean;
  url: string;
  description: string | null;
  postedAt: Date | null;
};

/** View model de una vacante para la UI. */
export type JobVM = {
  id: string;
  source: string;
  company: string;
  title: string;
  location: string | null;
  remote: boolean;
  url: string;
  postedAt: Date | null;
};

/** Detalle de vacante (incluye la descripción para la página de detalle/IA). */
export type JobDetailVM = JobVM & {
  description: string | null;
};

/** Criterios de búsqueda/filtrado aplicados por las fuentes o la lectura. */
export type JobQuery = {
  /** Palabras clave; matchean contra el título (case-insensitive, OR). */
  keywords?: string[];
  remoteOnly?: boolean;
};

/**
 * Abstracción de una fuente de empleos. Cada portal (Greenhouse, Lever, ...)
 * implementa esta interfaz. Agregar una fuente nueva = una clase nueva, sin
 * tocar el agregador (Open/Closed).
 */
export interface JobSource {
  /** Nombre estable de la fuente, usado como `source` en la DB. */
  readonly name: string;
  /** Trae las vacantes ya normalizadas, aplicando el query si corresponde. */
  fetchJobs(query: JobQuery): Promise<NormalizedJob[]>;
}
