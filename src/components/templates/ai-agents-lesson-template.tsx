import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { LessonCompleteButton } from "@/components/molecules/lesson-complete-button";
import { LessonQuiz } from "@/components/organisms/lesson-quiz";
import {
  getAdjacentLessons,
  getLessonBySlug,
} from "@/domain/learning/ai-agents/lessons";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import { getPublicQuiz } from "@/domain/learning/ai-agents/quizzes/score-quiz";
import {
  lessonCodeSamplesUrl,
  lessonLocalizedText,
  lessonReadmeUrl,
  lessonVideoUrl,
} from "@/domain/learning/ai-agents/lesson.types";
import { getLessonProgressState } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

type AiAgentsLessonPageProps = {
  params: Promise<{ slug: string }>;
};

export async function AiAgentsLessonTemplate({ params }: AiAgentsLessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const t = await getTranslations("aiAgents");
  const locale = await getLocale();
  const user = await getCurrentUser();
  const progressState = await getLessonProgressState(
    user?.id ?? null,
    AI_AGENTS_MODULE_ID,
    slug,
  );
  const quiz = getPublicQuiz(slug);
  const { prev, next } = getAdjacentLessons(slug);
  const title = lessonLocalizedText(locale, lesson.title);
  const summary = lessonLocalizedText(locale, lesson.summary);

  return (
    <article className="flex flex-col gap-6">
      <Link
        href="/learn/ai-agents"
        className="text-sm text-muted-foreground underline"
      >
        {t("backToModule")}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("lessonNumber", { n: lesson.order })}
        </p>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{summary}</p>
      </header>

      <section aria-labelledby="lesson-resources-heading">
        <h2 id="lesson-resources-heading" className="mb-3 text-lg font-semibold">
          {t("resourcesTitle")}
        </h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <a
              href={lessonReadmeUrl(lesson.folder)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("readmeLink")}
            </a>
          </li>
          <li>
            <a
              href={lessonCodeSamplesUrl(lesson.folder)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("codeLink")}
            </a>
          </li>
          {lesson.videoId ? (
            <li>
              <a
                href={lessonVideoUrl(lesson.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {t("videoLink")}
              </a>
            </li>
          ) : null}
        </ul>
      </section>

      {quiz ? (
        <LessonQuiz
          quiz={quiz}
          locale={locale}
          moduleId={AI_AGENTS_MODULE_ID}
          lessonSlug={slug}
          isLoggedIn={Boolean(user)}
          initialScore={progressState.quizScore}
          initialPassed={progressState.quizPassed}
        />
      ) : null}

      <LessonCompleteButton
        moduleId={AI_AGENTS_MODULE_ID}
        lessonSlug={slug}
        completed={progressState.completed}
        isLoggedIn={Boolean(user)}
      />

      <nav
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"
        aria-label={t("lessonNavLabel")}
      >
        {prev ? (
          <Link
            href={`/learn/ai-agents/${prev.slug}`}
            className="text-sm font-medium underline"
          >
            ← {lessonLocalizedText(locale, prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/ai-agents/${next.slug}`}
            className="text-sm font-medium underline"
          >
            {lessonLocalizedText(locale, next.title)} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
