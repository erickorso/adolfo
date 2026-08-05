"use server";

import { revalidatePath } from "next/cache";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import { PYTHON_AI_MODULE_ID } from "@/domain/learning/python-ai/module.constants";
import { ARCHITECTURE_PRACTICES_MODULE_ID } from "@/domain/learning/architecture-practices/module.constants";
import type { QuizSubmitResult } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import type { LessonToggleResult } from "@/domain/learning/learning.types";
import {
  claimCertificate,
  completeLessonMission,
  submitLessonQuiz,
  toggleLessonComplete,
  toggleLessonMission,
  type LessonMissionKind,
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

export type MissionActionResult =
  | { ok: true; missions: { readme: boolean; video: boolean; code: boolean } }
  | { ok: false; error: "loginRequired" | "notFound" };

export type CompleteMissionActionResult =
  | {
      ok: true;
      missions: { readme: boolean; video: boolean; code: boolean };
      xpAwarded: number;
    }
  | { ok: false; error: "loginRequired" | "notFound" };

function revalidateLearnModule(lessonSlug: string, moduleId: string) {
  if (moduleId === AI_AGENTS_MODULE_ID) {
    revalidatePath("/learn/ai-agents");
    revalidatePath(`/learn/ai-agents/${lessonSlug}`);
  }
  if (moduleId === PYTHON_AI_MODULE_ID) {
    revalidatePath("/learn/python-ai");
    revalidatePath(`/learn/python-ai/${lessonSlug}`);
  }
  if (moduleId === ARCHITECTURE_PRACTICES_MODULE_ID) {
    revalidatePath("/learn/architecture-practices");
    revalidatePath(`/learn/architecture-practices/${lessonSlug}`);
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
    revalidateLearnModule(lessonSlug, moduleId);

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
    revalidateLearnModule(lessonSlug, moduleId);

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

export async function toggleLessonMissionAction(
  moduleId: string,
  lessonSlug: string,
  kind: LessonMissionKind,
): Promise<MissionActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    const missions = await toggleLessonMission(
      user.id,
      moduleId,
      lessonSlug,
      kind,
    );
    revalidateLearnModule(lessonSlug, moduleId);
    return { ok: true, missions };
  } catch {
    return { ok: false, error: "notFound" };
  }
}

export async function completeLessonMissionAction(
  moduleId: string,
  lessonSlug: string,
  kind: LessonMissionKind,
): Promise<CompleteMissionActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    const result = await completeLessonMission(
      user.id,
      moduleId,
      lessonSlug,
      kind,
    );
    revalidateLearnModule(lessonSlug, moduleId);
    return { ok: true, missions: result.missions, xpAwarded: result.xpAwarded };
  } catch {
    return { ok: false, error: "notFound" };
  }
}

export async function claimCertificateAction(): Promise<
  { ok: true; earnedAt: string } | { ok: false; error: "loginRequired" | "notEligible" }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    const earnedAt = await claimCertificate(user.id, AI_AGENTS_MODULE_ID);
    revalidatePath("/learn/ai-agents");
    revalidatePath("/learn/ai-agents/certificate");
    return { ok: true, earnedAt: earnedAt.toISOString() };
  } catch {
    return { ok: false, error: "notEligible" };
  }
}
