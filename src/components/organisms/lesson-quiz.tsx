"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { submitLessonQuizAction } from "@/app/[locale]/learn/actions";
import type { LessonQuizPublic } from "@/domain/learning/ai-agents/quizzes/quiz.types";
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
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

    const missing = quiz.questions.some((q) => !answers[q.id]);
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
      className="rounded-lg border border-border bg-card p-6"
      aria-labelledby="lesson-quiz-heading"
    >
      <h2 id="lesson-quiz-heading" className="mb-2 text-lg font-semibold">
        {t("quizTitle")}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("quizHint", { percent: quiz.passPercent })}
      </p>

      {!isLoggedIn ? (
        <p className="text-sm text-muted-foreground">{t("loginToTrack")}</p>
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
          const prompt = lessonLocalizedText(locale, question.prompt);
          const resultItem = feedback?.find((f) => f.questionId === question.id);

          return (
            <fieldset
              key={question.id}
              className="flex flex-col gap-3 rounded-md border border-border p-4"
            >
              <legend className="px-1 text-sm font-medium">
                {index + 1}. {prompt}
              </legend>
              <div className="flex flex-col gap-2">
                {question.options.map((option) => {
                  const label = lessonLocalizedText(locale, option.label);
                  const checked = answers[question.id] === option.id;

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm",
                        checked ? "border-primary bg-primary/5" : "border-border",
                        resultItem &&
                          (resultItem.correct
                            ? checked && "border-emerald-500"
                            : checked && !resultItem.correct && "border-destructive"),
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={checked}
                        disabled={pending || (submitted && initialPassed)}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option.id,
                          }))
                        }
                        className="mt-0.5"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
              {resultItem ? (
                <p
                  className={cn(
                    "text-xs",
                    resultItem.correct
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground",
                  )}
                >
                  {resultItem.explanation}
                </p>
              ) : null}
            </fieldset>
          );
        })}

        {!(submitted && initialPassed) ? (
          <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {pending ? t("quizSubmitting") : t("quizSubmit")}
          </button>
        ) : null}
      </form>
    </section>
  );
}
