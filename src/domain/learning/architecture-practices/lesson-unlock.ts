import { ARCHITECTURE_PRACTICES_LESSONS } from "@/domain/learning/architecture-practices/lessons";

export type ArchitecturePracticesUnlockProgress = {
  isLoggedIn: boolean;
  completedSlugs: string[];
};

/** Secuencial por lección completada. */
export function isArchitecturePracticesLessonUnlocked(
  lessonSlug: string,
  progress: ArchitecturePracticesUnlockProgress,
): boolean {
  if (!progress.isLoggedIn) {
    return true;
  }

  const index = ARCHITECTURE_PRACTICES_LESSONS.findIndex(
    (l) => l.slug === lessonSlug,
  );
  if (index <= 0) {
    return true;
  }

  const previousSlug = ARCHITECTURE_PRACTICES_LESSONS[index - 1]!.slug;
  return progress.completedSlugs.includes(previousSlug);
}
