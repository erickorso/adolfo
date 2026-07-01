"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { submitLessonQuizAction } from "@/app/[locale]/learn/actions";
import { QuizChoiceQuestion } from "@/components/molecules/quiz-choice-question";
import { QuizDragOrder } from "@/components/molecules/quiz-drag-order";
import type { LessonQuizPublic } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import { isOrderQuestion } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import {
  serializeOrder,
  shuffleIds,
} from "@/domain/learning/ai-agents/quizzes/order-answer";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import { cn } from "@/lib/utils";

type LessonQuizProps = {
  quiz: LessonQuizPublic;
  locale: string;
  moduleId: string;
  lessonSlug: string;
  isLoggedIn: boolean;
  initialScore: number | null;
  initialPassed: boolean;
};

function isQuestionAnswered(
  question: LessonQuizPublic["questions"][number],
  answers: Record<string, string>,
): boolean {
  const value = answers[question.id];
  return Boolean(value && value.length > 0);
}

export function LessonQuiz({
  quiz,
  locale,
  moduleId,
  lessonSlug,
  isLoggedIn,
  initialScore,
  initialPassed,
}: LessonQuizProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const question of quiz.questions) {
      if (isOrderQuestion(question)) {
        initial[question.id] = serializeOrder(
          shuffleIds(
            question.items.map((item) => item.id),
            question.id,
          ),
        );
      }
    }
    return initial;
  });
  const [submitted, setSubmitted] = useState(initialPassed);
  const [score, setScore] = useState<number | null>(initialScore);
  const [feedback, setFeedback] = useState<
    Array<{ questionId: string; correct: boolean; explanation: string }> | null
  >(null);
  const [xpAwarded, setXpAwarded] = useState(0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
      return;
    }

    const missing = quiz.questions.some((q) => !isQuestionAnswered(q, answers));
    if (missing) {
      return;
    }

    startTransition(async () => {
      const result = await submitLessonQuizAction(moduleId, lessonSlug, answers);

      if (!result.ok) {
        if (result.error === "loginRequired") {
          router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
        }
        return;
      }

      setScore(result.score);
      setSubmitted(result.passed);
      setXpAwarded(result.xpAwarded);
      setFeedback(
        result.results.map((item) => ({
          questionId: item.questionId,
          correct: item.correct,
          explanation: lessonLocalizedText(locale, item.explanation),
        })),
      );
      router.refresh();
    });
  }

  return (
    <section
      className="learn-path__card p-6"
      aria-labelledby="lesson-quiz-heading"
    >
      <h2 id="lesson-quiz-heading" className="learn-path__card-title mb-2 text-lg font-semibold">
        {t("quizTitle")}
      </h2>
      <p className="learn-path__card-muted mb-4 text-sm">
        {t("quizHint", { percent: quiz.passPercent })}
      </p>

      {!isLoggedIn ? (
        <p className="learn-path__card-muted text-sm">{t("loginToTrack")}</p>
      ) : null}

      {submitted && score != null ? (
        <p
          className={cn(
            "mb-4 rounded-md px-3 py-2 text-sm font-medium",
            submitted
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-800 dark:text-amber-300",
          )}
          role="status"
        >
          {submitted
            ? t("quizPassed", { score, xp: xpAwarded || 0 })
            : t("quizFailed", { score, percent: quiz.passPercent })}
        </p>
      ) : null}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => {
          const resultItem = feedback?.find((f) => f.questionId === question.id);

          if (isOrderQuestion(question)) {
            const prompt = lessonLocalizedText(locale, question.prompt);
            return (
              <fieldset
                key={question.id}
                className="learn-path__card flex flex-col gap-3 p-4"
              >
                <legend className="learn-path__card-title px-1 text-sm font-semibold">
                  {index + 1}. {prompt}
                </legend>
                <QuizDragOrder
                  items={question.items}
                  locale={locale}
                  value={answers[question.id] ?? ""}
                  onChange={(serialized) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: serialized,
                    }))
                  }
                  disabled={pending || (submitted && initialPassed)}
                  showFeedback={Boolean(resultItem)}
                  hint={t("dragOrderHint")}
                />
                {resultItem ? (
                  <p
                    className={cn(
                      "text-xs",
                      resultItem.correct
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "learn-path__card-muted",
                    )}
                  >
                    {resultItem.explanation}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          return (
            <QuizChoiceQuestion
              key={question.id}
              question={question}
              index={index}
              locale={locale}
              selected={answers[question.id]}
              disabled={pending || (submitted && initialPassed)}
              onSelect={(optionId) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: optionId,
                }))
              }
              feedback={
                resultItem
                  ? {
                      correct: resultItem.correct,
                      explanation: resultItem.explanation,
                    }
                  : null
              }
            />
          );
        })}

        {!(submitted && initialPassed) ? (
          <button
            type="submit"
            disabled={pending}
            className="learn-path__btn w-fit px-4 py-2 text-sm disabled:opacity-60"
          >
            {pending ? t("quizSubmitting") : t("quizSubmit")}
          </button>
        ) : null}
      </form>
    </section>
  );
}
