import "server-only";
import { prisma } from "@/lib/prisma";
import {
  AI_AGENTS_MODULE_ID,
  XP_PER_LESSON,
  XP_PER_QUIZ_PASS,
} from "@/domain/learning/ai-agents/module.constants";
import { scoreQuizAnswers } from "@/domain/learning/ai-agents/quizzes/score-quiz";
import { getLessonBySlug, AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import type {
  LessonToggleResult,
  ModuleProgressVM,
} from "@/domain/learning/learning.types";
import type { QuizSubmitResult } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import { computeStreakUpdate } from "@/domain/learning/streak";

export type LessonProgressState = {
  completed: boolean;
  quizScore: number | null;
  quizPassed: boolean;
};

function resolveTotalLessons(moduleId: string): number {
  if (moduleId === AI_AGENTS_MODULE_ID) {
    return AI_AGENTS_LESSONS.length;
  }
  return 0;
}

function assertLessonExists(moduleId: string, lessonSlug: string): void {
  if (moduleId === AI_AGENTS_MODULE_ID && !getLessonBySlug(lessonSlug)) {
    throw new Error("Lección no encontrada");
  }
}

function buildProgressVM(
  moduleId: string,
  completedSlugs: string[],
  quizPassedSlugs: string[],
  totalXp: number,
  streakDays: number,
  isLoggedIn: boolean,
): ModuleProgressVM {
  const totalLessons = resolveTotalLessons(moduleId);
  const completedCount = completedSlugs.length;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    moduleId,
    completedSlugs,
    quizPassedSlugs,
    totalLessons,
    completedCount,
    percent,
    totalXp,
    streakDays,
    isLoggedIn,
  };
}

export async function getModuleProgress(
  userId: string | null,
  moduleId: string,
): Promise<ModuleProgressVM> {
  if (!userId) {
    return buildProgressVM(moduleId, [], [], 0, 0, false);
  }

  const [rows, profile] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, moduleId },
      select: {
        lessonSlug: true,
        completedAt: true,
        quizPassedAt: true,
      },
    }),
    prisma.learningProfile.findUnique({ where: { userId } }),
  ]);

  return buildProgressVM(
    moduleId,
    rows.filter((r) => r.completedAt).map((r) => r.lessonSlug),
    rows.filter((r) => r.quizPassedAt).map((r) => r.lessonSlug),
    profile?.totalXp ?? 0,
    profile?.streakDays ?? 0,
    true,
  );
}

export async function getLessonProgressState(
  userId: string | null,
  moduleId: string,
  lessonSlug: string,
): Promise<LessonProgressState> {
  if (!userId) {
    return { completed: false, quizScore: null, quizPassed: false };
  }

  const row = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  if (!row) {
    return { completed: false, quizScore: null, quizPassed: false };
  }

  return {
    completed: Boolean(row.completedAt),
    quizScore: row.quizScore,
    quizPassed: Boolean(row.quizPassedAt),
  };
}

export async function isLessonCompleted(
  userId: string | null,
  moduleId: string,
  lessonSlug: string,
): Promise<boolean> {
  const state = await getLessonProgressState(userId, moduleId, lessonSlug);
  return state.completed;
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

export async function toggleLessonComplete(
  userId: string,
  moduleId: string,
  lessonSlug: string,
): Promise<LessonToggleResult> {
  assertLessonExists(moduleId, lessonSlug);

  const existing = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  if (existing?.completedAt) {
    await prisma.$transaction(async (tx) => {
      const lessonXp = existing.xpEarned;

      if (existing.quizPassedAt || existing.quizScore != null) {
        await tx.lessonProgress.update({
          where: { id: existing.id },
          data: { completedAt: null, xpEarned: 0 },
        });
      } else {
        await tx.lessonProgress.delete({ where: { id: existing.id } });
      }

      if (lessonXp > 0) {
        const profile = await tx.learningProfile.findUnique({ where: { userId } });
        if (profile) {
          await tx.learningProfile.update({
            where: { userId },
            data: { totalXp: Math.max(0, profile.totalXp - lessonXp) },
          });
        }
      }
    });

    return {
      completed: false,
      progress: await getModuleProgress(userId, moduleId),
    };
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.lessonProgress.upsert({
      where: {
        userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
      },
      create: {
        userId,
        moduleId,
        lessonSlug,
        completedAt: now,
        xpEarned: XP_PER_LESSON,
      },
      update: {
        completedAt: now,
        xpEarned: XP_PER_LESSON,
      },
    });

    await applyStreakAndXp(tx, userId, XP_PER_LESSON);
  });

  return {
    completed: true,
    progress: await getModuleProgress(userId, moduleId),
  };
}

export async function submitLessonQuiz(
  userId: string,
  moduleId: string,
  lessonSlug: string,
  answers: Record<string, string>,
): Promise<QuizSubmitResult> {
  assertLessonExists(moduleId, lessonSlug);

  const scored = scoreQuizAnswers(lessonSlug, answers);
  if (!scored) {
    throw new Error("Quiz no encontrado");
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  const alreadyPassed = Boolean(existing?.quizPassedAt);
  let xpAwarded = 0;

  await prisma.$transaction(async (tx) => {
    const bestScore = Math.max(existing?.quizScore ?? 0, scored.score);

    await tx.lessonProgress.upsert({
      where: {
        userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
      },
      create: {
        userId,
        moduleId,
        lessonSlug,
        quizScore: scored.score,
        quizPassedAt: scored.passed ? new Date() : null,
        quizXpEarned: scored.passed && !alreadyPassed ? XP_PER_QUIZ_PASS : 0,
      },
      update: {
        quizScore: bestScore,
        ...(scored.passed && !existing?.quizPassedAt
          ? { quizPassedAt: new Date(), quizXpEarned: XP_PER_QUIZ_PASS }
          : {}),
      },
    });

    if (scored.passed && !alreadyPassed) {
      xpAwarded = XP_PER_QUIZ_PASS;
      await applyStreakAndXp(tx, userId, XP_PER_QUIZ_PASS);
    }
  });

  return { ...scored, xpAwarded };
}
