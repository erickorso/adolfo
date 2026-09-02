export type LocalizedText = { es: string; en: string };

export function lessonLocalizedText(locale: string, text: LocalizedText): string {
  return locale.startsWith("es") ? text.es : text.en;
}

export type EnglishA1Lesson = {
  slug: string;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  tip: LocalizedText;
};
