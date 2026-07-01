import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Lock, Trophy } from "lucide-react";
import type { AiAgentsLesson } from "@/domain/learning/ai-agents/lesson.types";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import { isLessonUnlocked } from "@/domain/learning/ai-agents/lesson-unlock";
import { cn } from "@/lib/utils";

type AiAgentsLessonListProps = {
  completedSlugs: string[];
  quizPassedSlugs: string[];
  isLoggedIn: boolean;
};

export async function AiAgentsLessonList({
  completedSlugs,
  quizPassedSlugs,
  isLoggedIn,
}: AiAgentsLessonListProps) {
  const t = await getTranslations("aiAgents");
  const completedSet = new Set(completedSlugs);
  const quizPassedSet = new Set(quizPassedSlugs);
  const unlockProgress = { isLoggedIn, completedSlugs, quizPassedSlugs };

  return (
    <ol className="flex flex-col gap-3" aria-label={t("lessonListLabel")}>
      {AI_AGENTS_LESSONS.map((lesson) => (
        <LessonRow
          key={lesson.slug}
          lesson={lesson}
          completed={completedSet.has(lesson.slug)}
          quizPassed={quizPassedSet.has(lesson.slug)}
          unlocked={isLessonUnlocked(lesson.slug, unlockProgress)}
        />
      ))}
    </ol>
  );
}

async function LessonRow({
  lesson,
  completed,
  quizPassed,
  unlocked,
}: {
  lesson: AiAgentsLesson;
  completed: boolean;
  quizPassed: boolean;
  unlocked: boolean;
}) {
  const t = await getTranslations("aiAgents");
  const locale = await getLocale();
  const title = lessonLocalizedText(locale, lesson.title);

  return (
    <li
      className={cn(
        "rounded-lg border bg-card p-4",
        completed ? "border-primary/40" : "border-border",
        !unlocked && "opacity-70",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {t("lessonNumber", { n: lesson.order })}
          </span>
          <div className="flex items-center gap-2">
            {!unlocked ? (
              <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            ) : completed ? (
              <CheckCircle2
                className="size-4 shrink-0 text-primary"
                aria-label={t("lessonCompleted")}
              />
            ) : null}
            {unlocked ? (
              <Link
                href={`/learn/ai-agents/${lesson.slug}`}
                className="text-base font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {title}
              </Link>
            ) : (
              <span className="text-base font-semibold text-muted-foreground">
                {title}
              </span>
            )}
          </div>
          {!unlocked ? (
            <span className="text-xs text-muted-foreground">{t("lessonLockedShort")}</span>
          ) : null}
          {lesson.comingSoon ? (
            <span className="text-xs text-muted-foreground">{t("comingSoon")}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {lesson.videoId ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {t("hasVideo")}
            </span>
          ) : null}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {t("hasCode")}
          </span>
          {quizPassed ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
              aria-label={t("quizPassedBadge")}
            >
              <Trophy className="size-3" aria-hidden />
              {t("quizPassedShort")}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}
