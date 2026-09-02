"use client";

import {
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ENGLISH_A1_EXERCISE_INITIAL_STATE,
  submitEnglishA1ExerciseAction,
} from "@/app/[locale]/learn/english-a1/actions";
import { EnglishA1ChoiceExercise } from "@/components/molecules/english-a1-choice-exercise";
import { EnglishA1FillBlankExercise } from "@/components/molecules/english-a1-fill-blank-exercise";
import { EnglishA1WordBankExercise } from "@/components/molecules/english-a1-word-bank-exercise";
import type { EnglishA1Exercise } from "@/domain/learning/english-a1/exercise.types";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { cn } from "@/lib/utils";

type OptimisticResult = {
  exerciseId: string;
  correct: boolean;
};

type EnglishA1ExerciseSessionProps = {
  exercises: EnglishA1Exercise[];
  lessonSlug: string;
  locale: string;
  isLoggedIn: boolean;
  initialCorrectIds: string[];
  initialScorePercent: number;
  lessonPassed: boolean;
};

function SubmitExerciseButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations("englishA1");

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
    >
      {pending ? t("submitting") : t("submitAnswer")}
    </button>
  );
}

export function EnglishA1ExerciseSession({
  exercises,
  lessonSlug,
  locale,
  isLoggedIn,
  initialCorrectIds,
  initialScorePercent,
  lessonPassed,
}: EnglishA1ExerciseSessionProps) {
  const t = useTranslations("englishA1");
  const router = useRouter();
  const startedAt = useRef(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastFeedback, setLastFeedback] = useState<{
    exerciseId: string;
    correct: boolean;
    explanation?: string;
  } | null>(null);
  const [, startTransition] = useTransition();

  const [optimisticCorrect, addOptimisticCorrect] = useOptimistic(
    initialCorrectIds,
    (state, result: OptimisticResult) =>
      result.correct && !state.includes(result.exerciseId)
        ? [...state, result.exerciseId]
        : state,
  );

  const [actionState, formAction] = useActionState(
    submitEnglishA1ExerciseAction,
    ENGLISH_A1_EXERCISE_INITIAL_STATE,
  );

  const current = exercises[currentIndex];

  useEffect(() => {
    if (!actionState.ok || actionState.correct === undefined) {
      return;
    }

    const exerciseId = exercises[currentIndex]?.id;
    if (!exerciseId) {
      return;
    }

    setLastFeedback({
      exerciseId,
      correct: actionState.correct,
      explanation: actionState.explanation,
    });

    if (actionState.lessonPassed) {
      router.refresh();
    }
  }, [actionState, currentIndex, exercises, router]);

  if (!current) {
    return (
      <p className="text-sm text-muted-foreground">{t("noExercises")}</p>
    );
  }

  const currentAnswer = answers[current.id] ?? "";
  const isCurrentCorrect = optimisticCorrect.includes(current.id);
  const showResult = lastFeedback?.exerciseId === current.id;
  const scorePercent =
    exercises.length > 0
      ? Math.round((optimisticCorrect.length / exercises.length) * 100)
      : initialScorePercent;

  function handleFormAction(formData: FormData) {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/learn/english-a1/${lessonSlug}`);
      return;
    }

    if (!currentAnswer.trim()) {
      return;
    }

    formData.set("exerciseId", current.id);
    formData.set("answer", currentAnswer);
    formData.set("lessonSlug", lessonSlug);
    formData.set("locale", locale);
    formData.set(
      "durationMs",
      String(Math.max(0, Date.now() - startedAt.current)),
    );

    startTransition(() => {
      addOptimisticCorrect({ exerciseId: current.id, correct: true });
    });

    formAction(formData);
  }

  return (
    <section
      className="rounded-lg border border-border bg-card p-5"
      aria-labelledby="english-a1-session-heading"
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="english-a1-session-heading" className="text-lg font-semibold">
          {t("practiceTitle")}
        </h2>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t("progressExercises", {
            current: currentIndex + 1,
            total: exercises.length,
            percent: scorePercent,
          })}
        </p>
      </header>

      {!isLoggedIn ? (
        <p className="mb-4 text-sm text-muted-foreground">{t("loginToTrack")}</p>
      ) : null}

      {(lessonPassed || scorePercent >= 70) && optimisticCorrect.length > 0 ? (
        <p
          className="mb-4 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
          role="status"
        >
          {t("lessonPassed", { percent: scorePercent })}
        </p>
      ) : null}

      <form action={handleFormAction} className="flex flex-col gap-4">
        {current.type === "choice" ? (
          <EnglishA1ChoiceExercise
            exercise={current}
            locale={locale}
            value={currentAnswer}
            disabled={isCurrentCorrect && showResult}
            showResult={showResult}
            correct={lastFeedback?.correct}
            onSelect={(id) =>
              setAnswers((prev) => ({ ...prev, [current.id]: id }))
            }
          />
        ) : null}

        {current.type === "fill-blank" ? (
          <EnglishA1FillBlankExercise
            exercise={current}
            locale={locale}
            value={currentAnswer}
            disabled={isCurrentCorrect && showResult}
            showResult={showResult}
            correct={lastFeedback?.correct}
            onChange={(v) =>
              setAnswers((prev) => ({ ...prev, [current.id]: v }))
            }
          />
        ) : null}

        {current.type === "word-bank" ? (
          <EnglishA1WordBankExercise
            exercise={current}
            locale={locale}
            value={currentAnswer}
            disabled={isCurrentCorrect && showResult}
            showResult={showResult}
            correct={lastFeedback?.correct}
            onChange={(v) =>
              setAnswers((prev) => ({ ...prev, [current.id]: v }))
            }
          />
        ) : null}

        {lastFeedback?.explanation && showResult ? (
          <p className="text-xs text-muted-foreground">
            {lastFeedback.explanation}
          </p>
        ) : null}

        {actionState.ok && actionState.xpAwarded ? (
          <p className="text-xs font-medium text-primary" role="status">
            {t("xpEarned", { xp: actionState.xpAwarded })}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {!(isCurrentCorrect && showResult) ? (
            <SubmitExerciseButton disabled={!currentAnswer.trim()} />
          ) : null}

          {showResult && currentIndex < exercises.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((i) => i + 1);
                setLastFeedback(null);
                startedAt.current = Date.now();
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              {t("nextExercise")}
            </button>
          ) : null}

          {currentIndex > 0 ? (
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((i) => i - 1);
                setLastFeedback(null);
              }}
              className="rounded-md px-4 py-2 text-sm text-muted-foreground underline"
            >
              {t("prevExercise")}
            </button>
          ) : null}
        </div>
      </form>

      <ul
        className="mt-4 flex flex-wrap gap-1"
        aria-label={t("exerciseDotsLabel")}
      >
        {exercises.map((ex, i) => (
          <li key={ex.id}>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(i);
                setLastFeedback(null);
              }}
              className={cn(
                "size-2.5 rounded-full",
                optimisticCorrect.includes(ex.id)
                  ? "bg-emerald-500"
                  : i === currentIndex
                    ? "bg-primary"
                    : "bg-muted",
              )}
              aria-label={lessonLocalizedText(locale, ex.prompt)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
