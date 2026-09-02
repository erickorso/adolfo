import { ENGLISH_A1_LESSONS } from "./lessons";

export type EnglishA1UnlockProgress = {
  isLoggedIn: boolean;
  completedSlugs: string[];
};

/** Secuencial: completá la lección anterior para desbloquear. Sin login = preview libre. */
export function isEnglishA1LessonUnlocked(
  lessonSlug: string,
  progress: EnglishA1UnlockProgress,
): boolean {
  if (!progress.isLoggedIn) {
    return true;
  }

  const index = ENGLISH_A1_LESSONS.findIndex((l) => l.slug === lessonSlug);
  if (index <= 0) {
    return true;
  }

  const previousSlug = ENGLISH_A1_LESSONS[index - 1]!.slug;
  return progress.completedSlugs.includes(previousSlug);
}
