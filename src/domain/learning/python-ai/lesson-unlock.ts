import { PYTHON_AI_LESSONS } from "@/domain/learning/python-ai/lessons";

export type PythonAiUnlockProgress = {
  isLoggedIn: boolean;
  completedSlugs: string[];
};

/** Secuencial por lección completada (sin quizzes en v1). */
export function isPythonAiLessonUnlocked(
  lessonSlug: string,
  progress: PythonAiUnlockProgress,
): boolean {
  if (!progress.isLoggedIn) {
    return true;
  }

  const index = PYTHON_AI_LESSONS.findIndex((l) => l.slug === lessonSlug);
  if (index <= 0) {
    return true;
  }

  const previousSlug = PYTHON_AI_LESSONS[index - 1]!.slug;
  return progress.completedSlugs.includes(previousSlug);
}
