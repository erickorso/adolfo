import {
  FP_CERTIFICADO_SOURCE,
  FP_PROVIDER_DEFAULT,
} from "@/domain/fp/fp.constants";
import type { NormalizedFpCertificate } from "@/domain/fp/fp.types";

/** Fila cruda del dataset JCyL `certificados-profesionalidad`. */
export type JcylFpRecord = {
  familia: string | null;
  codigo: string | null;
  denominacion: string | null;
  consultar_estructura: string | null;
  consultar_programa_real_decreto: string | null;
  nivel_cp: number | null;
  horas_totales_certificado: number | null;
  completa_en_teleformacion: string | null;
  real_decreto: string | null;
};

export function requiresBachillerForLevel(level: 1 | 2 | 3): boolean {
  return level === 3;
}

export function accessLabelForLevel(level: 1 | 2 | 3): string {
  switch (level) {
    case 1:
      return "Nivel 1 — sin requisito académico";
    case 2:
      return "Nivel 2 — ESO o equivalente (sin Bachiller)";
    case 3:
      return "Nivel 3 — Bachiller o equivalente / vías alternativas";
  }
}

function parseLevel(raw: number | null): 1 | 2 | 3 | null {
  if (raw === 1 || raw === 2 || raw === 3) return raw;
  return null;
}

/**
 * Mapea un registro JCyL/SEPE a FP normalizado.
 * Devuelve null si faltan código, título o nivel válido.
 */
export function mapJcylRecordToFp(
  row: JcylFpRecord,
): NormalizedFpCertificate | null {
  const externalId = row.codigo?.trim();
  const title = row.denominacion?.trim();
  const level = parseLevel(row.nivel_cp);
  if (!externalId || !title || !level) return null;

  const hours = Math.max(0, Math.round(row.horas_totales_certificado ?? 0));
  const requiresBachiller = requiresBachillerForLevel(level);
  const access = accessLabelForLevel(level);
  const rd = row.real_decreto?.trim();

  return {
    source: FP_CERTIFICADO_SOURCE,
    externalId,
    title,
    description: [
      "Certificado profesional (FP corto / Grado C).",
      access,
      rd ? `Real Decreto ${rd}.` : null,
    ]
      .filter(Boolean)
      .join(" "),
    family: row.familia?.trim() || null,
    level,
    requiresBachiller,
    hours,
    modality: "mixta",
    url:
      row.consultar_estructura?.trim() ||
      `https://sede.sepe.gob.es/especialidadesformativas/RXBuscadorEFRED/DetalleEspecialidadFormativa.do?metodo=modulada&codEspecialidad=${encodeURIComponent(externalId)}`,
    programUrl: row.consultar_programa_real_decreto?.trim() || null,
    teleformation: row.completa_en_teleformacion?.trim() || null,
    provider: FP_PROVIDER_DEFAULT,
    location: "España",
  };
}
