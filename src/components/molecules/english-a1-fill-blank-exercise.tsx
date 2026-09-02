"use client";

import { useTranslations } from "next-intl";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import type { FillBlankExercise } from "@/domain/learning/english-a1/exercise.types";
import { cn } from "@/lib/utils";

type EnglishA1FillBlankExerciseProps = {
  exercise: FillBlankExercise;
  locale: string;
  value: string;
  disabled?: boolean;
  showResult?: boolean;
  correct?: boolean;
  onChange: (value: string) => void;
};

export function EnglishA1FillBlankExercise({
  exercise,
  locale,
  value,
  disabled,
  showResult,
  correct,
  onChange,
}: EnglishA1FillBlankExerciseProps) {
  const t = useTranslations("englishA1");

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`fill-${exercise.id}`} className="text-sm font-semibold">
        {lessonLocalizedText(locale, exercise.prompt)}
      </label>
      <input
        id={`fill-${exercise.id}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "rounded-md border border-input bg-background px-3 py-2 text-sm",
          showResult &&
            correct &&
            "border-emerald-500 bg-emerald-500/10",
          showResult &&
            !correct &&
            "border-destructive bg-destructive/10",
        )}
        aria-describedby={showResult ? `fill-feedback-${exercise.id}` : undefined}
      />
      {showResult ? (
        <p
          id={`fill-feedback-${exercise.id}`}
          className={cn(
            "text-xs",
            correct
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground",
          )}
          role="status"
        >
          {correct ? t("exerciseCorrect") : t("exerciseWrong")}
        </p>
      ) : null}
    </div>
  );
}
