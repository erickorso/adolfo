"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EnglishA1DictionaryText } from "@/components/molecules/english-a1-dictionary-text";

export type CompletedLessonNote = {
  slug: string;
  order: number;
  title: string;
  grammar: string;
  scorePercent: number;
  isCurrent: boolean;
};

type EnglishA1LessonsNotesSidebarProps = {
  lessons: CompletedLessonNote[];
};

export function EnglishA1LessonsNotesSidebar({
  lessons,
}: EnglishA1LessonsNotesSidebarProps) {
  const t = useTranslations("englishA1");

  return (
    <aside
      className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
      aria-labelledby="english-a1-notes-sidebar-heading"
    >
      <h2
        id="english-a1-notes-sidebar-heading"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {t("completedLessonsTitle")}
      </h2>

      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noCompletedLessons")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {lessons.map((lesson) => (
            <li
              key={lesson.slug}
              className="rounded-md border border-border bg-background p-3"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("lessonNumber", { n: lesson.order + 1 })}
                </p>
                <span className="shrink-0 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {t("lessonScore", { percent: lesson.scorePercent })}
                </span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">{lesson.title}</h3>
              <p className="mb-3 line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                <EnglishA1DictionaryText text={lesson.grammar} />
              </p>
              {lesson.isCurrent ? (
                <span className="text-xs font-medium text-primary">
                  {t("currentLesson")}
                </span>
              ) : (
                <Link
                  href={`/learn/english-a1/${lesson.slug}`}
                  className="text-xs font-medium text-primary underline"
                >
                  {t("reviewLesson")}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
