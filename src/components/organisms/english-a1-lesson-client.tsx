"use client";

import type { EnglishA1Exercise } from "@/domain/learning/english-a1/exercise.types";
import type { EnglishA1Lesson } from "@/domain/learning/english-a1/lesson.types";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { EnglishA1DictionaryText } from "@/components/molecules/english-a1-dictionary-text";
import { EnglishA1ExerciseSession } from "@/components/organisms/english-a1-exercise-session";
import { EnglishA1VocabProvider } from "@/components/organisms/english-a1-vocab-provider";

type EnglishA1LessonClientProps = {
  lesson: EnglishA1Lesson;
  locale: string;
  exercises: EnglishA1Exercise[];
  lessonSlug: string;
  isLoggedIn: boolean;
  initialCorrectIds: string[];
  initialScorePercent: number;
  lessonPassed: boolean;
  tipTitle: string;
  grammarTitle: string;
};

export function EnglishA1LessonClient({
  lesson,
  locale,
  exercises,
  lessonSlug,
  isLoggedIn,
  initialCorrectIds,
  initialScorePercent,
  lessonPassed,
  tipTitle,
  grammarTitle,
}: EnglishA1LessonClientProps) {
  return (
    <EnglishA1VocabProvider>
      <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-5 dark:border-violet-900 dark:bg-violet-950/20">
        <h2 className="mb-2 text-base font-semibold">{grammarTitle}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          <EnglishA1DictionaryText
            text={lessonLocalizedText(locale, lesson.grammar)}
          />
        </p>
      </section>

      <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900 dark:bg-sky-950/20">
        <h2 className="mb-2 text-base font-semibold">{tipTitle}</h2>
        <p className="text-sm text-muted-foreground">
          <EnglishA1DictionaryText
            text={lessonLocalizedText(locale, lesson.tip)}
          />
        </p>
      </section>

      <EnglishA1ExerciseSession
        exercises={exercises}
        lessonSlug={lessonSlug}
        locale={locale}
        isLoggedIn={isLoggedIn}
        initialCorrectIds={initialCorrectIds}
        initialScorePercent={initialScorePercent}
        lessonPassed={lessonPassed}
      />
    </EnglishA1VocabProvider>
  );
}
