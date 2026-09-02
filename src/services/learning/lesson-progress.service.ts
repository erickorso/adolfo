import "server-only";
import { prisma } from "@/lib/prisma";
import {
  AI_AGENTS_MODULE_ID,
  XP_PER_LESSON,
  XP_PER_MISSION,
  XP_PER_QUIZ_PASS,
} from "@/domain/learning/ai-agents/module.constants";
import { buildCertificateStatus } from "@/domain/learning/ai-agents/certificate";
import type { CertificateStatusVM } from "@/domain/learning/ai-agents/certificate";
import { getLessonBySlug, AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import {
  resolveNextStep,
  type NextStepVM,
} from "@/domain/learning/ai-agents/next-step";
import type {
  LessonToggleResult,
  ModuleProgressVM,
} from "@/domain/learning/learning.types";
import type { QuizSubmitResult } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import { scoreQuizAnswers } from "@/domain/learning/ai-agents/quizzes/score-quiz";
import { computeStreakUpdate } from "@/domain/learning/streak";
import { PYTHON_AI_MODULE_ID } from "@/domain/learning/python-ai/module.constants";
import {
  getLessonBySlug as getPythonAiLessonBySlug,
  PYTHON_AI_LESSONS,
} from "@/domain/learning/python-ai/lessons";
import { ARCHITECTURE_PRACTICES_MODULE_ID } from "@/domain/learning/architecture-practices/module.constants";
import {
  getLessonBySlug as getArchitecturePracticesLessonBySlug,
  ARCHITECTURE_PRACTICES_LESSONS,
} from "@/domain/learning/architecture-practices/lessons";
import { ENGLISH_A1_MODULE_ID } from "@/domain/learning/english-a1/module.constants";
import {
  getLessonBySlug as getEnglishA1LessonBySlug,
  ENGLISH_A1_LESSONS,
} from "@/domain/learning/english-a1/lessons";

export type LessonMissionState = {
  readme: boolean;
  video: boolean;
  code: boolean;
};

export type LessonProgressState = {
  completed: boolean;
  quizScore: number | null;
  quizPassed: boolean;
  missions: LessonMissionState;
};

export type LessonMissionKind = "readme" | "video" | "code";

function emptyMissions(): LessonMissionState {
  return { readme: false, video: false, code: false };
}

function hasPersistedProgress(row: {
  quizPassedAt: Date | null;
  quizScore: number | null;
  missionReadme: boolean;
  missionVideo: boolean;
  missionCode: boolean;
  missionXpEarned: number;
}): boolean {
  return (
    Boolean(row.quizPassedAt) ||
    row.quizScore != null ||
    row.missionReadme ||
    row.missionVideo ||
    row.missionCode ||
    row.missionXpEarned > 0
  );
}

function resolveTotalLessons(moduleId: string): number {
  if (moduleId === AI_AGENTS_MODULE_ID) {
    return AI_AGENTS_LESSONS.length;
  }
  if (moduleId === PYTHON_AI_MODULE_ID) {
    return PYTHON_AI_LESSONS.length;
  }
  if (moduleId === ARCHITECTURE_PRACTICES_MODULE_ID) {
    return ARCHITECTURE_PRACTICES_LESSONS.length;
  }
  if (moduleId === ENGLISH_A1_MODULE_ID) {
    return ENGLISH_A1_LESSONS.length;
  }
  return 0;
}

function assertLessonExists(moduleId: string, lessonSlug: string): void {
  if (moduleId === AI_AGENTS_MODULE_ID && !getLessonBySlug(lessonSlug)) {
    throw new Error("Lección no encontrada");
  }
  if (
    moduleId === PYTHON_AI_MODULE_ID &&
    !getPythonAiLessonBySlug(lessonSlug)
  ) {
    throw new Error("Lección no encontrada");
  }
  if (
    moduleId === ARCHITECTURE_PRACTICES_MODULE_ID &&
    !getArchitecturePracticesLessonBySlug(lessonSlug)
  ) {
    throw new Error("Lección no encontrada");
  }
  if (
    moduleId === ENGLISH_A1_MODULE_ID &&
    !getEnglishA1LessonBySlug(lessonSlug)
  ) {
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
    return {
      completed: false,
      quizScore: null,
      quizPassed: false,
      missions: emptyMissions(),
    };
  }

  const row = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  if (!row) {
    return {
      completed: false,
      quizScore: null,
      quizPassed: false,
      missions: emptyMissions(),
    };
  }

  return {
    completed: Boolean(row.completedAt),
    quizScore: row.quizScore,
    quizPassed: Boolean(row.quizPassedAt),
    missions: {
      readme: row.missionReadme,
      video: row.missionVideo,
      code: row.missionCode,
    },
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

      if (hasPersistedProgress(existing)) {
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

function missionField(kind: LessonMissionKind): "missionReadme" | "missionVideo" | "missionCode" {
  if (kind === "readme") return "missionReadme";
  if (kind === "video") return "missionVideo";
  return "missionCode";
}

export async function completeLessonMission(
  userId: string,
  moduleId: string,
  lessonSlug: string,
  kind: LessonMissionKind,
): Promise<{ missions: LessonMissionState; xpAwarded: number }> {
  assertLessonExists(moduleId, lessonSlug);

  const lesson = getLessonBySlug(lessonSlug);
  if (kind === "video" && !lesson?.videoId) {
    throw new Error("Misión no disponible");
  }

  const field = missionField(kind);
  const existing = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  if (existing?.[field]) {
    const state = await getLessonProgressState(userId, moduleId, lessonSlug);
    return { missions: state.missions, xpAwarded: 0 };
  }

  await prisma.$transaction(async (tx) => {
    const missionData =
      field === "missionReadme"
        ? { missionReadme: true }
        : field === "missionVideo"
          ? { missionVideo: true }
          : { missionCode: true };

    await tx.lessonProgress.upsert({
      where: {
        userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
      },
      create: {
        userId,
        moduleId,
        lessonSlug,
        ...missionData,
        missionXpEarned: XP_PER_MISSION,
      },
      update: {
        ...missionData,
        missionXpEarned: { increment: XP_PER_MISSION },
      },
    });

    await applyStreakAndXp(tx, userId, XP_PER_MISSION);
  });

  const state = await getLessonProgressState(userId, moduleId, lessonSlug);
  return { missions: state.missions, xpAwarded: XP_PER_MISSION };
}

export async function getNextLearningStep(
  userId: string | null,
  moduleId: string,
): Promise<NextStepVM> {
  const progress = await getModuleProgress(userId, moduleId);

  if (!userId) {
    return {
      type: "lesson",
      slug: AI_AGENTS_LESSONS[0]?.slug ?? "course-setup",
      focus: "missions",
    };
  }

  const rows = await prisma.lessonProgress.findMany({
    where: { userId, moduleId },
    select: {
      lessonSlug: true,
      completedAt: true,
      quizPassedAt: true,
      missionReadme: true,
      missionVideo: true,
      missionCode: true,
    },
  });

  const rowBySlug = new Map(rows.map((row) => [row.lessonSlug, row]));

  const lessons = AI_AGENTS_LESSONS.map((lesson) => {
    const row = rowBySlug.get(lesson.slug);
    return {
      slug: lesson.slug,
      hasVideo: Boolean(lesson.videoId),
      missions: {
        readme: row?.missionReadme ?? false,
        video: row?.missionVideo ?? false,
        code: row?.missionCode ?? false,
      },
      completed: Boolean(row?.completedAt),
      quizPassed: Boolean(row?.quizPassedAt),
    };
  });

  const profile = await prisma.learningProfile.findUnique({ where: { userId } });
  const certificate = buildCertificateStatus(
    progress.completedSlugs,
    progress.quizPassedSlugs,
    profile?.certificateEarnedAt ?? null,
  );

  return resolveNextStep(
    {
      isLoggedIn: true,
      completedSlugs: progress.completedSlugs,
      quizPassedSlugs: progress.quizPassedSlugs,
    },
    lessons,
    certificate,
  );
}

export async function toggleLessonMission(
  userId: string,
  moduleId: string,
  lessonSlug: string,
  kind: LessonMissionKind,
): Promise<LessonMissionState> {
  assertLessonExists(moduleId, lessonSlug);

  const lesson = getLessonBySlug(lessonSlug);
  if (kind === "video" && !lesson?.videoId) {
    throw new Error("Misión no disponible");
  }

  const field = missionField(kind);
  const existing = await prisma.lessonProgress.findUnique({
    where: {
      userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
    },
  });

  const currentlyDone = existing?.[field] ?? false;
  const xpDelta = currentlyDone ? -XP_PER_MISSION : XP_PER_MISSION;

  await prisma.$transaction(async (tx) => {
    const nextValue = !currentlyDone;
    const nextMissionXp = Math.max(
      0,
      (existing?.missionXpEarned ?? 0) + xpDelta,
    );

    const missionData =
      field === "missionReadme"
        ? { missionReadme: nextValue }
        : field === "missionVideo"
          ? { missionVideo: nextValue }
          : { missionCode: nextValue };

    await tx.lessonProgress.upsert({
      where: {
        userId_moduleId_lessonSlug: { userId, moduleId, lessonSlug },
      },
      create: {
        userId,
        moduleId,
        lessonSlug,
        ...missionData,
        missionXpEarned: nextValue ? XP_PER_MISSION : 0,
      },
      update: {
        ...missionData,
        missionXpEarned: nextMissionXp,
      },
    });

    await applyStreakAndXp(tx, userId, xpDelta);
  });

  const state = await getLessonProgressState(userId, moduleId, lessonSlug);
  return state.missions;
}

export type CertificateStatusWithAuth = CertificateStatusVM & {
  isLoggedIn: boolean;
  userName: string | null;
};

export async function getCertificateStatus(
  userId: string | null,
  moduleId: string,
): Promise<CertificateStatusWithAuth> {
  if (!userId) {
    return {
      ...buildCertificateStatus([], [], null),
      isLoggedIn: false,
      userName: null,
    };
  }

  const [progress, profile, user] = await Promise.all([
    getModuleProgress(userId, moduleId),
    prisma.learningProfile.findUnique({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
  ]);

  return {
    ...buildCertificateStatus(
      progress.completedSlugs,
      progress.quizPassedSlugs,
      profile?.certificateEarnedAt ?? null,
    ),
    isLoggedIn: true,
    userName: user?.name ?? null,
  };
}

export async function claimCertificate(
  userId: string,
  moduleId: string,
): Promise<Date> {
  const status = await getCertificateStatus(userId, moduleId);
  if (!status.eligible) {
    throw new Error("Certificado no disponible");
  }

  if (status.earnedAt) {
    return status.earnedAt;
  }

  const profile = await prisma.learningProfile.upsert({
    where: { userId },
    create: {
      userId,
      certificateEarnedAt: new Date(),
    },
    update: {
      certificateEarnedAt: new Date(),
    },
  });

  return profile.certificateEarnedAt!;
}
