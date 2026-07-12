export type LocalizedText = { es: string; en: string };

export type PathStep = {
  id: string;
  order: number;
  title: LocalizedText;
  body: LocalizedText;
  deliverable?: LocalizedText;
};

export type PathPhase = {
  slug: string;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  durationWeeks?: string;
  steps: PathStep[];
  relatedHref?: string;
  relatedLabel?: LocalizedText;
};

export function pathLocalizedText(locale: string, text: LocalizedText): string {
  return locale === "en" ? text.en : text.es;
}
