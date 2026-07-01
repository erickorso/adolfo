import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import { getQuizSlugsWithQuiz } from "@/domain/learning/ai-agents/quizzes/quiz-data";

export type CertificateStatusVM = {
  eligible: boolean;
  earnedAt: Date | null;
  quizzesPassed: number;
  quizzesRequired: number;
  lessonsCompleted: number;
  lessonsTotal: number;
};

export function buildCertificateStatus(
  completedSlugs: string[],
  quizPassedSlugs: string[],
  earnedAt: Date | null,
): CertificateStatusVM {
  const quizzesRequired = getQuizSlugsWithQuiz().length;
  const lessonsTotal = AI_AGENTS_LESSONS.length;
  const quizzesPassed = quizPassedSlugs.length;
  const lessonsCompleted = completedSlugs.length;

  const eligible =
    quizzesPassed >= quizzesRequired &&
    quizzesRequired === lessonsTotal &&
    lessonsCompleted >= lessonsTotal;

  return {
    eligible,
    earnedAt,
    quizzesPassed,
    quizzesRequired,
    lessonsCompleted,
    lessonsTotal,
  };
}
