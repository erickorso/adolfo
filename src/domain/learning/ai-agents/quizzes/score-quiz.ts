import { QUIZ_PASS_PERCENT } from "@/domain/learning/ai-agents/module.constants";
import { getQuizByLessonSlug } from "@/domain/learning/ai-agents/quizzes/quiz-data";
import type {
  LessonQuizPublic,
  QuizSubmitResult,
} from "@/domain/learning/ai-agents/quizzes/quiz.types";

export function getPublicQuiz(lessonSlug: string): LessonQuizPublic | null {
  const quiz = getQuizByLessonSlug(lessonSlug);
  if (!quiz) {
    return null;
  }

  return {
    lessonSlug: quiz.lessonSlug,
    passPercent: QUIZ_PASS_PERCENT,
    questions: quiz.questions.map(({ id, prompt, options }) => ({
      id,
      prompt,
      options,
    })),
  };
}

export function scoreQuizAnswers(
  lessonSlug: string,
  answers: Record<string, string>,
): QuizSubmitResult | null {
  const quiz = getQuizByLessonSlug(lessonSlug);
  if (!quiz) {
    return null;
  }

  const results = quiz.questions.map((question) => {
    const selected = answers[question.id];
    const correct = selected === question.correctOptionId;
    return {
      questionId: question.id,
      correct,
      explanation: question.explanation,
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const total = quiz.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= QUIZ_PASS_PERCENT;

  return {
    score,
    passed,
    correctCount,
    total,
    xpAwarded: 0,
    results,
  };
}
