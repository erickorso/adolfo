import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import { getQuizByLessonSlug } from "@/domain/learning/ai-agents/quizzes/quiz-data";

export type UnlockProgress = {
  isLoggedIn: boolean;
  completedSlugs: string[];
  quizPassedSlugs: string[];
};

export function isLessonRequirementMet(
  lessonSlug: string,
  progress: UnlockProgress,
): boolean {
  const hasQuiz = Boolean(getQuizByLessonSlug(lessonSlug));
  if (hasQuiz) {
    return progress.quizPassedSlugs.includes(lessonSlug);
  }
  return progress.completedSlugs.includes(lessonSlug);
}

export function isLessonUnlocked(
  lessonSlug: string,
  progress: UnlockProgress,
): boolean {
  if (!progress.isLoggedIn) {
    return true;
  }

  const index = AI_AGENTS_LESSONS.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index <= 0) {
    return true;
  }

  const previousSlug = AI_AGENTS_LESSONS[index - 1]!.slug;
  return isLessonRequirementMet(previousSlug, progress);
}

export function getPreviousLessonSlug(lessonSlug: string): string | undefined {
  const index = AI_AGENTS_LESSONS.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index <= 0) {
    return undefined;
  }
  return AI_AGENTS_LESSONS[index - 1]!.slug;
}
