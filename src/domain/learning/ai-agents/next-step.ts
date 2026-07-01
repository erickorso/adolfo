import type { CertificateStatusVM } from "@/domain/learning/ai-agents/certificate";
import { getQuizByLessonSlug } from "@/domain/learning/ai-agents/quizzes/quiz-data";
import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import {
  isLessonUnlocked,
  type UnlockProgress,
} from "@/domain/learning/ai-agents/lesson-unlock";
import type { LessonMissionState } from "@/services/learning/lesson-progress.service";

export type NextStepFocus = "missions" | "quiz" | "complete";

export type NextStepVM =
  | { type: "lesson"; slug: string; focus: NextStepFocus }
  | { type: "certificate" }
  | { type: "celebrate" };

export type LessonStepInput = {
  slug: string;
  hasVideo: boolean;
  missions: LessonMissionState;
  completed: boolean;
  quizPassed: boolean;
};

function missionsPending(
  lesson: LessonStepInput,
): boolean {
  if (!lesson.missions.readme) {
    return true;
  }
  if (lesson.hasVideo && !lesson.missions.video) {
    return true;
  }
  if (!lesson.missions.code) {
    return true;
  }
  return false;
}

export function resolveNextStep(
  unlockProgress: UnlockProgress,
  lessons: LessonStepInput[],
  certificate: CertificateStatusVM,
): NextStepVM {
  if (certificate.eligible && !certificate.earnedAt) {
    return { type: "certificate" };
  }

  if (certificate.earnedAt) {
    return { type: "celebrate" };
  }

  for (const lesson of lessons) {
    if (!isLessonUnlocked(lesson.slug, unlockProgress)) {
      break;
    }

    if (missionsPending(lesson)) {
      return { type: "lesson", slug: lesson.slug, focus: "missions" };
    }

    const hasQuiz = Boolean(getQuizByLessonSlug(lesson.slug));
    if (hasQuiz && !lesson.quizPassed) {
      return { type: "lesson", slug: lesson.slug, focus: "quiz" };
    }

    if (!lesson.completed) {
      return { type: "lesson", slug: lesson.slug, focus: "complete" };
    }
  }

  const first = AI_AGENTS_LESSONS[0];
  return {
    type: "lesson",
    slug: first?.slug ?? "course-setup",
    focus: "missions",
  };
}
