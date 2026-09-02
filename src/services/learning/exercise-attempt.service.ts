import "server-only";
import { prisma } from "@/lib/prisma";
import {
  ENGLISH_A1_MODULE_ID,
  LESSON_PASS_PERCENT,
  XP_PER_EXERCISE_CORRECT,
  XP_PER_LESSON_PASS,
} from "@/domain/learning/english-a1/module.constants";
import {
  getExercisesForLesson,
  getLessonSlugForExercise,
  getExerciseById,
} from "@/domain/learning/english-a1/exercises";
import { getLessonBySlug } from "@/domain/learning/english-a1/lessons";
import { scoreExerciseAnswer } from "@/domain/learning/english-a1/score-exercise";
import { computeStreakUpdate } from "@/domain/learning/streak";

export type ExerciseSubmitResult = {
  correct: boolean;
  xpAwarded: number;
  lessonPassed: boolean;
  lessonScorePercent: number;
};

export type LessonExerciseStats = {
  total: number;
  correctExerciseIds: string[];
  scorePercent: number;
  passed: boolean;
};

export async function getLessonExerciseStats(
  userId: string | null,
  lessonSlug: string,
): Promise<LessonExerciseStats> {
  const exercises = getExercisesForLesson(lessonSlug);
  const total = exercises.length;

  if (!userId || total === 0) {
    return { total, correctExerciseIds: [], scorePercent: 0, passed: false };
  }

  const attempts = await prisma.exerciseAttempt.findMany({
    where: {
      userId,
      moduleId: ENGLISH_A1_MODULE_ID,
      lessonSlug,
      correct: true,
    },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });

  const correctExerciseIds = attempts.map((a) => a.exerciseId);
  const scorePercent = Math.round((correctExerciseIds.length / total) * 100);
  const passed = scorePercent >= LESSON_PASS_PERCENT;

  return { total, correctExerciseIds, scorePercent, passed };
}

async function applyStreakAndXp(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userId: string,
  xpDelta: number,
): Promise<void> {
  if (xpDelta === 0) {
    return;
  }

  const now = new Date();
  const profile = await tx.learningProfile.findUnique({ where: { userId } });
  const streak = computeStreakUpdate(profile, now);

  await tx.learningProfile.upsert({
    where: { userId },
    create: {
      userId,
      totalXp: Math.max(0, xpDelta),
      streakDays: streak.streakDays,
      lastActivityDate: streak.lastActivityDate,
    },
    update: {
      totalXp: { increment: xpDelta },
      streakDays: streak.streakDays,
      lastActivityDate: streak.lastActivityDate,
    },
  });
}

async function maybeCompleteLesson(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userId: string,
  lessonSlug: string,
): Promise<{ lessonPassed: boolean; lessonXp: number }> {
  const exercises = getExercisesForLesson(lessonSlug);
  const total = exercises.length;
  if (total === 0) {
    return { lessonPassed: false, lessonXp: 0 };
  }

  const correctAttempts = await tx.exerciseAttempt.findMany({
    where: {
      userId,
      moduleId: ENGLISH_A1_MODULE_ID,
      lessonSlug,
      correct: true,
    },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });

  const scorePercent = Math.round(
    (correctAttempts.length / total) * 100,
  );
  const passed = scorePercent >= LESSON_PASS_PERCENT;

  if (!passed) {
    return { lessonPassed: false, lessonXp: 0 };
  }

  const existing = await tx.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: {
        userId,
        moduleId: ENGLISH_A1_MODULE_ID,
        lessonSlug,
      },
    },
  });

  if (existing?.completedAt) {
    return { lessonPassed: true, lessonXp: 0 };
  }

  const lessonXp = XP_PER_LESSON_PASS;

  await tx.lessonProgress.upsert({
    where: {
      userId_moduleId_lessonSlug: {
        userId,
        moduleId: ENGLISH_A1_MODULE_ID,
        lessonSlug,
      },
    },
    create: {
      userId,
      moduleId: ENGLISH_A1_MODULE_ID,
      lessonSlug,
      completedAt: new Date(),
      xpEarned: lessonXp,
    },
    update: {
      completedAt: new Date(),
      xpEarned: lessonXp,
    },
  });

  await applyStreakAndXp(tx, userId, lessonXp);

  return { lessonPassed: true, lessonXp };
}

export async function submitExerciseAttempt(
  userId: string,
  exerciseId: string,
  answer: string,
  durationMs = 0,
): Promise<ExerciseSubmitResult> {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    throw new Error("Ejercicio no encontrado");
  }

  const lessonSlug = getLessonSlugForExercise(exerciseId);
  if (!lessonSlug || !getLessonBySlug(lessonSlug)) {
    throw new Error("Lección no encontrada");
  }

  const scored = scoreExerciseAnswer(exerciseId, answer);
  if (!scored) {
    throw new Error("No se pudo evaluar el ejercicio");
  }

  let xpAwarded = 0;
  let lessonPassed = false;
  let lessonScorePercent = 0;

  await prisma.$transaction(async (tx) => {
    const priorCorrect = scored.correct
      ? await tx.exerciseAttempt.findFirst({
          where: {
            userId,
            moduleId: ENGLISH_A1_MODULE_ID,
            exerciseId,
            correct: true,
          },
        })
      : null;

    await tx.exerciseAttempt.create({
      data: {
        userId,
        moduleId: ENGLISH_A1_MODULE_ID,
        lessonSlug,
        exerciseId,
        correct: scored.correct,
        answer: scored.normalizedAnswer,
        durationMs,
      },
    });

    if (scored.correct && !priorCorrect) {
      xpAwarded = XP_PER_EXERCISE_CORRECT;
      await applyStreakAndXp(tx, userId, xpAwarded);
    }

    const completion = await maybeCompleteLesson(tx, userId, lessonSlug);
    lessonPassed = completion.lessonPassed;

    const exercises = getExercisesForLesson(lessonSlug);
    const correctCount = await tx.exerciseAttempt.findMany({
      where: {
        userId,
        moduleId: ENGLISH_A1_MODULE_ID,
        lessonSlug,
        correct: true,
      },
      select: { exerciseId: true },
      distinct: ["exerciseId"],
    });
    lessonScorePercent =
      exercises.length > 0
        ? Math.round((correctCount.length / exercises.length) * 100)
        : 0;
  });

  return {
    correct: scored.correct,
    xpAwarded,
    lessonPassed,
    lessonScorePercent,
  };
}
