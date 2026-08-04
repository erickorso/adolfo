export type ArchitecturePracticesLesson = {
  slug: string;
  order: number;
  hours: number;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  body: { es: string; en: string };
  bullets?: { es: string; en: string }[];
  deliverable: { es: string; en: string };
  resources?: { label: { es: string; en: string }; href: string }[];
};

export function lessonLocalizedText(
  locale: string,
  text: { es: string; en: string },
): string {
  return locale === "es" ? text.es : text.en;
}
