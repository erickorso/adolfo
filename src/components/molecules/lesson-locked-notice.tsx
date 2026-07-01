import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Lock } from "lucide-react";
import { getPreviousLessonSlug } from "@/domain/learning/ai-agents/lesson-unlock";
import { getQuizByLessonSlug } from "@/domain/learning/ai-agents/quizzes/quiz-data";
import { getLessonBySlug } from "@/domain/learning/ai-agents/lessons";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";

type LessonLockedNoticeProps = {
  lessonSlug: string;
};

export async function LessonLockedNotice({ lessonSlug }: LessonLockedNoticeProps) {
  const t = await getTranslations("aiAgents");
  const locale = await getLocale();
  const previousSlug = getPreviousLessonSlug(lessonSlug);
  const previous = previousSlug ? getLessonBySlug(previousSlug) : undefined;
  const previousHasQuiz = previousSlug
    ? Boolean(getQuizByLessonSlug(previousSlug))
    : false;

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-6"
      role="status"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="size-5" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">{t("lessonLocked")}</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        {previousHasQuiz ? t("lessonLockedQuizHint") : t("lessonLockedCompleteHint")}
      </p>
      {previous ? (
        <Link
          href={`/learn/ai-agents/${previous.slug}`}
          className="w-fit text-sm font-medium underline"
        >
          ← {lessonLocalizedText(locale, previous.title)}
        </Link>
      ) : null}
      <Link href="/learn/ai-agents" className="w-fit text-sm underline">
        {t("backToModule")}
      </Link>
    </div>
  );
}
