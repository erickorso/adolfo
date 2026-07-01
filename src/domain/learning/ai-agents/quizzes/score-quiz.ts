import { QUIZ_PASS_PERCENT } from "@/domain/learning/ai-agents/module.constants";
import { getQuizByLessonSlug } from "@/domain/learning/ai-agents/quizzes/quiz-data";
import { isOrderCorrect } from "@/domain/learning/ai-agents/quizzes/order-answer";
import type {
  LessonQuizPublic,
  QuizQuestion,
  QuizSubmitResult,
} from "@/domain/learning/ai-agents/quizzes/quiz.types";
import { isOrderQuestion } from "@/domain/learning/ai-agents/quizzes/quiz.types";

function scoreQuestion(question: QuizQuestion, selected: string | undefined): boolean {
  if (isOrderQuestion(question)) {
    return Boolean(selected && isOrderCorrect(selected, question.correctOrder));
  }

  return selected === question.correctOptionId;
}

export function getPublicQuiz(lessonSlug: string): LessonQuizPublic | null {
  const quiz = getQuizByLessonSlug(lessonSlug);
  if (!quiz) {
    return null;
  }

  return {
    lessonSlug: quiz.lessonSlug,
    passPercent: QUIZ_PASS_PERCENT,
    questions: quiz.questions.map((question) => {
      if (isOrderQuestion(question)) {
        return {
          type: "order" as const,
          id: question.id,
          prompt: question.prompt,
          items: question.items,
        };
      }

      return {
        type: "choice" as const,
        id: question.id,
        prompt: question.prompt,
        options: question.options,
      };
    }),
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
    const correct = scoreQuestion(question, selected);
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
