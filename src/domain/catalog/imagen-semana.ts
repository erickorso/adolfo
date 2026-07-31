/**
 * Pool de variantes para el drop semanal `imagen-semana`.
 * Archivos en `public/catalog/imagen-semana/*.webp`.
 * La rotación la hace el cron `/api/catalog/imagen-semana/rotate`.
 */
export const IMAGEN_SEMANA_SLUG = "imagen-semana" as const;

export type ImagenSemanaVariant = {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
};

export const IMAGEN_SEMANA_VARIANTS: readonly ImagenSemanaVariant[] = [
  {
    id: "retrato",
    imageUrl: "/catalog/imagen-semana/retrato.webp",
    name: "Imagen de la semana — Retrato",
    description:
      "Foto exclusiva de la semana (retrato). Drop simbólico a $5 ARS.",
    nameEn: "Image of the week — Portrait",
    descriptionEn:
      "Exclusive photo of the week (portrait). Symbolic drop at $5 ARS.",
  },
  {
    id: "frente",
    imageUrl: "/catalog/imagen-semana/frente.webp",
    name: "Imagen de la semana — Frente",
    description:
      "Foto exclusiva de la semana (frente). Drop simbólico a $5 ARS.",
    nameEn: "Image of the week — Front",
    descriptionEn:
      "Exclusive photo of the week (front). Symbolic drop at $5 ARS.",
  },
  {
    id: "perfil",
    imageUrl: "/catalog/imagen-semana/perfil.webp",
    name: "Imagen de la semana — Perfil",
    description:
      "Foto exclusiva de la semana (perfil). Drop simbólico a $5 ARS.",
    nameEn: "Image of the week — Profile",
    descriptionEn:
      "Exclusive photo of the week (profile). Symbolic drop at $5 ARS.",
  },
  {
    id: "espalda",
    imageUrl: "/catalog/imagen-semana/espalda.webp",
    name: "Imagen de la semana — Espalda",
    description:
      "Foto exclusiva de la semana (espalda). Drop simbólico a $5 ARS.",
    nameEn: "Image of the week — Back",
    descriptionEn:
      "Exclusive photo of the week (back). Symbolic drop at $5 ARS.",
  },
] as const;

/** Semana ISO (1–53) → índice estable en el pool. */
export function imagenSemanaVariantForDate(
  date: Date = new Date(),
): ImagenSemanaVariant {
  const week = isoWeekNumber(date);
  const index = (week - 1) % IMAGEN_SEMANA_VARIANTS.length;
  return IMAGEN_SEMANA_VARIANTS[index]!;
}

function isoWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}
