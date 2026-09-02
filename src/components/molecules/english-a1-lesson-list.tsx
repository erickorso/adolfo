import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { ENGLISH_A1_LESSONS } from "@/domain/learning/english-a1/lessons";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { isEnglishA1LessonUnlocked } from "@/domain/learning/english-a1/lesson-unlock";
import { cn } from "@/lib/utils";

type EnglishA1LessonListProps = {
  completedSlugs: string[];
  isLoggedIn: boolean;
};

export async function EnglishA1LessonList({
  completedSlugs,
  isLoggedIn,
}: EnglishA1LessonListProps) {
  const [t, locale] = await Promise.all([
    getTranslations("englishA1"),
    getLocale(),
  ]);

  return (
    <ol className="flex flex-col gap-2" aria-label={t("lessonListLabel")}>
      {ENGLISH_A1_LESSONS.map((lesson) => {
        const unlocked = isEnglishA1LessonUnlocked(lesson.slug, {
          isLoggedIn,
          completedSlugs,
        });
        const completed = completedSlugs.includes(lesson.slug);

        return (
          <li key={lesson.slug}>
            {unlocked ? (
              <Link
                href={`/learn/english-a1/${lesson.slug}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted/50",
                  completed && "border-emerald-500/40",
                )}
              >
                <span>
                  <span className="font-medium">
                    {t("lessonNumber", { n: lesson.order + 1 })} —{" "}
                    {lessonLocalizedText(locale, lesson.title)}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {lessonLocalizedText(locale, lesson.summary)}
                  </span>
                </span>
                {completed ? (
                  <CheckCircle2
                    className="size-5 shrink-0 text-emerald-600"
                    aria-label={t("lessonCompleted")}
                  />
                ) : null}
              </Link>
            ) : (
              <div
                className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"
                aria-disabled
              >
                <Lock className="size-4 shrink-0" aria-hidden />
                <span>
                  {t("lessonNumber", { n: lesson.order + 1 })} —{" "}
                  {lessonLocalizedText(locale, lesson.title)}
                  <span className="mt-0.5 block text-xs">
                    {t("lessonLockedShort")}
                  </span>
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
