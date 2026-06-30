"use server";

import { revalidatePath } from "next/cache";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import type { QuizSubmitResult } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import type { LessonToggleResult } from "@/domain/learning/learning.types";
import {
  submitLessonQuiz,
  toggleLessonComplete,
} from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export type LearnActionResult =
  | { ok: true; completed: boolean; progress: LessonToggleResult["progress"] }
  | { ok: false; error: "loginRequired" | "notFound" };

export type QuizActionResult =
  | {
      ok: true;
      score: number;
      passed: boolean;
      xpAwarded: number;
      results: QuizSubmitResult["results"];
    }
  | { ok: false; error: "loginRequired" | "notFound" };

function revalidateAiAgents(lessonSlug: string, moduleId: string) {
  if (moduleId === AI_AGENTS_MODULE_ID) {
    revalidatePath("/learn/ai-agents");
    revalidatePath(`/learn/ai-agents/${lessonSlug}`);
  }
}

export async function toggleLessonCompleteAction(
  moduleId: string,
  lessonSlug: string,
): Promise<LearnActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    const result = await toggleLessonComplete(user.id, moduleId, lessonSlug);
    revalidateAiAgents(lessonSlug, moduleId);

    return {
      ok: true,
      completed: result.completed,
      progress: result.progress,
    };
  } catch {
    return { ok: false, error: "notFound" };
  }
}

export async function submitLessonQuizAction(
  moduleId: string,
  lessonSlug: string,
  answers: Record<string, string>,
): Promise<QuizActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    const result = await submitLessonQuiz(
      user.id,
      moduleId,
      lessonSlug,
      answers,
    );
    revalidateAiAgents(lessonSlug, moduleId);

    return {
      ok: true,
      score: result.score,
      passed: result.passed,
      xpAwarded: result.xpAwarded,
      results: result.results,
    };
  } catch {
    return { ok: false, error: "notFound" };
  }
}
