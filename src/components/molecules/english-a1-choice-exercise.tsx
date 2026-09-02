"use client";

import { useTranslations } from "next-intl";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { EnglishA1DictionaryText } from "@/components/molecules/english-a1-dictionary-text";
import type { ChoiceExercise } from "@/domain/learning/english-a1/exercise.types";
import { cn } from "@/lib/utils";

type EnglishA1ChoiceExerciseProps = {
  exercise: ChoiceExercise;
  locale: string;
  value: string;
  disabled?: boolean;
  showResult?: boolean;
  correct?: boolean;
  onSelect: (optionId: string) => void;
};

export function EnglishA1ChoiceExercise({
  exercise,
  locale,
  value,
  disabled,
  showResult,
  correct,
  onSelect,
}: EnglishA1ChoiceExerciseProps) {
  const t = useTranslations("englishA1");

  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled}>
      <legend className="text-sm font-semibold">
        <EnglishA1DictionaryText
          text={lessonLocalizedText(locale, exercise.prompt)}
        />
      </legend>
      <div className="flex flex-col gap-2" role="radiogroup">
        {exercise.options.map((option) => {
          const selected = value === option.id;
          const isCorrectOption = option.id === exercise.correctOptionId;
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                selected && "border-primary bg-primary/5",
                showResult &&
                  isCorrectOption &&
                  "border-emerald-500 bg-emerald-500/10",
                showResult &&
                  selected &&
                  !isCorrectOption &&
                  "border-destructive bg-destructive/10",
              )}
            >
              <input
                type="radio"
                name={exercise.id}
                value={option.id}
                checked={selected}
                onChange={() => onSelect(option.id)}
                className="size-4"
                aria-label={lessonLocalizedText(locale, option.text)}
              />
              <span>{lessonLocalizedText(locale, option.text)}</span>
            </label>
          );
        })}
      </div>
      {showResult ? (
        <p
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
    </fieldset>
  );
}
