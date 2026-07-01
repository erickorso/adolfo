"use client";

import type { QuizQuestionPublicChoice } from "@/domain/learning/ai-agents/quizzes/quiz.types";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import { cn } from "@/lib/utils";

type QuizChoiceQuestionProps = {
  question: QuizQuestionPublicChoice;
  index: number;
  locale: string;
  selected?: string;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
  feedback?: { correct: boolean; explanation: string } | null;
};

export function QuizChoiceQuestion({
  question,
  index,
  locale,
  selected,
  disabled = false,
  onSelect,
  feedback,
}: QuizChoiceQuestionProps) {
  const prompt = lessonLocalizedText(locale, question.prompt);

  return (
    <fieldset className="learn-path__card flex flex-col gap-3 p-4">
      <legend className="learn-path__card-title px-1 text-sm font-semibold">
        {index + 1}. {prompt}
      </legend>
      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const label = lessonLocalizedText(locale, option.label);
          const checked = selected === option.id;

          return (
            <label
              key={option.id}
              className={cn(
                "learn-quiz__choice flex cursor-pointer items-start gap-2 px-3 py-2 text-sm",
                checked && "learn-quiz__choice--selected",
                feedback &&
                  (feedback.correct
                    ? checked && "learn-quiz__choice--correct"
                    : checked && !feedback.correct && "learn-quiz__choice--wrong"),
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onSelect(option.id)}
                className="mt-0.5 accent-[var(--learn-accent)]"
              />
              <span className="learn-path__card-muted">{label}</span>
            </label>
          );
        })}
      </div>
      {feedback ? (
        <p
          className={cn(
            "text-xs",
            feedback.correct
              ? "text-emerald-700 dark:text-emerald-400"
              : "learn-path__card-muted",
          )}
        >
          {feedback.explanation}
        </p>
      ) : null}
    </fieldset>
  );
}
