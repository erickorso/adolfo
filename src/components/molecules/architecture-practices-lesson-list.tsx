import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { ARCHITECTURE_PRACTICES_LESSONS } from "@/domain/learning/architecture-practices/lessons";
import { isArchitecturePracticesLessonUnlocked } from "@/domain/learning/architecture-practices/lesson-unlock";
import { lessonLocalizedText } from "@/domain/learning/architecture-practices/lesson.types";
import { cn } from "@/lib/utils";

type ArchitecturePracticesLessonListProps = {
  completedSlugs: string[];
  isLoggedIn: boolean;
};

export async function ArchitecturePracticesLessonList({
  completedSlugs,
  isLoggedIn,
}: ArchitecturePracticesLessonListProps) {
  const t = await getTranslations("architecturePractices");
  const locale = await getLocale();
  const completedSet = new Set(completedSlugs);
  const unlockProgress = { isLoggedIn, completedSlugs };

  return (
    <ol className="flex flex-col gap-3" aria-label={t("lessonListLabel")}>
      {ARCHITECTURE_PRACTICES_LESSONS.map((lesson) => {
        const unlocked = isArchitecturePracticesLessonUnlocked(
          lesson.slug,
          unlockProgress,
        );
        const completed = completedSet.has(lesson.slug);
        const title = lessonLocalizedText(locale, lesson.title);
        const summary = lessonLocalizedText(locale, lesson.summary);

        return (
          <li
            key={lesson.slug}
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              completed && "ring-1 ring-primary/30",
              !unlocked && "opacity-70",
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {t("lessonNumber", { n: lesson.order })} · {lesson.hours}h
              </span>
              <div className="flex items-center gap-2">
                {!unlocked ? (
                  <Lock
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                ) : completed ? (
                  <CheckCircle2
                    className="size-4 shrink-0 text-primary"
                    aria-label={t("lessonCompleted")}
                  />
                ) : null}
                {unlocked ? (
                  <Link
                    href={`/learn/architecture-practices/${lesson.slug}`}
                    className="text-base font-semibold underline-offset-4 hover:underline"
                  >
                    {title}
                  </Link>
                ) : (
                  <span className="text-base font-semibold text-muted-foreground">
                    {title}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{summary}</p>
              {!unlocked ? (
                <span className="text-xs text-muted-foreground">
                  {t("lessonLockedShort")}
                </span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
