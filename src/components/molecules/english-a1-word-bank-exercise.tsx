"use client";

import { useTranslations } from "next-intl";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import type { WordBankExercise } from "@/domain/learning/english-a1/exercise.types";
import { serializeWordBankOrder } from "@/domain/learning/english-a1/score-exercise";
import { cn } from "@/lib/utils";

type EnglishA1WordBankExerciseProps = {
  exercise: WordBankExercise;
  locale: string;
  value: string;
  disabled?: boolean;
  showResult?: boolean;
  correct?: boolean;
  onChange: (serialized: string) => void;
};

function parseOrder(value: string): string[] {
  return value ? value.split("|").filter(Boolean) : [];
}

export function EnglishA1WordBankExercise({
  exercise,
  locale,
  value,
  disabled,
  showResult,
  correct,
  onChange,
}: EnglishA1WordBankExerciseProps) {
  const t = useTranslations("englishA1");
  const selected = parseOrder(value);

  const remaining = exercise.words.filter((word) => {
    const used = selected.filter((w) => w === word).length;
    const total = exercise.words.filter((w) => w === word).length;
    return used < total;
  });

  function addWord(word: string) {
    onChange(serializeWordBankOrder([...selected, word]));
  }

  function removeLast() {
    onChange(serializeWordBankOrder(selected.slice(0, -1)));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">
        {lessonLocalizedText(locale, exercise.prompt)}
      </p>
      <div
        className={cn(
          "min-h-10 rounded-md border border-dashed border-border px-3 py-2 text-sm",
          showResult &&
            correct &&
            "border-emerald-500 bg-emerald-500/10",
          showResult &&
            !correct &&
            "border-destructive bg-destructive/10",
        )}
        aria-live="polite"
      >
        {selected.length > 0 ? selected.join(" ") : t("wordBankPlaceholder")}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((word, i) => (
          <button
            key={`${word}-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => addWord(word)}
            className="rounded-md border border-border bg-card px-3 py-1 text-sm hover:bg-muted disabled:opacity-50"
          >
            {word}
          </button>
        ))}
        {selected.length > 0 && !disabled ? (
          <button
            type="button"
            onClick={removeLast}
            className="rounded-md px-3 py-1 text-sm text-muted-foreground underline"
          >
            {t("wordBankUndo")}
          </button>
        ) : null}
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
    </div>
  );
}
