import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AiAgentsLesson } from "@/domain/learning/ai-agents/lesson.types";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";

export async function AiAgentsLessonList() {
  const t = await getTranslations("aiAgents");

  return (
    <ol className="flex flex-col gap-3" aria-label={t("lessonListLabel")}>
      {AI_AGENTS_LESSONS.map((lesson) => (
        <LessonRow key={lesson.slug} lesson={lesson} />
      ))}
    </ol>
  );
}

async function LessonRow({ lesson }: { lesson: AiAgentsLesson }) {
  const t = await getTranslations("aiAgents");
  const locale = await getLocale();
  const title = lessonLocalizedText(locale, lesson.title);

  return (
    <li className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {t("lessonNumber", { n: lesson.order })}
          </span>
          <Link
            href={`/learn/ai-agents/${lesson.slug}`}
            className="text-base font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {title}
          </Link>
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
        </div>
      </div>
    </li>
  );
}
