"use server";

import { revalidatePath } from "next/cache";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { getExerciseById } from "@/domain/learning/english-a1/exercises";
import { scoreExerciseAnswer } from "@/domain/learning/english-a1/score-exercise";
import { submitExerciseAttempt } from "@/services/learning/exercise-attempt.service";
import { getCurrentUser } from "@/services/users/user.service";

export type EnglishA1ExerciseActionState = {
  ok: boolean;
  error?: "loginRequired" | "notFound" | "invalid";
  correct?: boolean;
  xpAwarded?: number;
  lessonPassed?: boolean;
  lessonScorePercent?: number;
  explanation?: string;
};

const INITIAL_STATE: EnglishA1ExerciseActionState = { ok: false };

export async function submitEnglishA1ExerciseAction(
  _prev: EnglishA1ExerciseActionState,
  formData: FormData,
): Promise<EnglishA1ExerciseActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  const exerciseId = String(formData.get("exerciseId") ?? "");
  const answer = String(formData.get("answer") ?? "");
  const durationMs = Number(formData.get("durationMs") ?? 0);
  const locale = String(formData.get("locale") ?? "es");

  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    return { ok: false, error: "notFound" };
  }

  if (!answer.trim()) {
    return { ok: false, error: "invalid" };
  }

  try {
    const result = await submitExerciseAttempt(
      user.id,
      exerciseId,
      answer,
      Number.isFinite(durationMs) ? durationMs : 0,
    );

    const scored = scoreExerciseAnswer(exerciseId, answer);
    const explanation = scored?.explanation
      ? lessonLocalizedText(locale, scored.explanation)
      : undefined;

    revalidatePath("/learn/english-a1");
    revalidatePath(`/learn/english-a1/${formData.get("lessonSlug") ?? ""}`);

    return {
      ok: true,
      correct: result.correct,
      xpAwarded: result.xpAwarded,
      lessonPassed: result.lessonPassed,
      lessonScorePercent: result.lessonScorePercent,
      explanation,
    };
  } catch {
    return { ok: false, error: "notFound" };
  }
}

export { INITIAL_STATE as ENGLISH_A1_EXERCISE_INITIAL_STATE };
