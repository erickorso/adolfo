export type AiAgentsLesson = {
  slug: string;
  order: number;
  folder: string;
  videoId?: string;
  comingSoon?: boolean;
  title: { es: string; en: string };
  summary: { es: string; en: string };
};

export const MICROSOFT_AI_AGENTS_REPO =
  "https://github.com/microsoft/ai-agents-for-beginners";

export const MICROSOFT_AI_AGENTS_SHORT_URL = "https://aka.ms/ai-agents-begginers";

export function lessonReadmeUrl(folder: string): string {
  return `${MICROSOFT_AI_AGENTS_REPO}/tree/main/${folder}`;
}

export function lessonCodeSamplesUrl(folder: string): string {
  return `${MICROSOFT_AI_AGENTS_REPO}/tree/main/${folder}/code_samples`;
}

export function lessonVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function lessonLocalizedText(
  locale: string,
  text: { es: string; en: string },
): string {
  return locale === "es" ? text.es : text.en;
}
