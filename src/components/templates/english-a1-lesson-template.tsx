import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { EnglishA1ExerciseSession } from "@/components/organisms/english-a1-exercise-session";
import {
  getAdjacentLessons,
  getLessonBySlug,
} from "@/domain/learning/english-a1/lessons";
import { getExercisesForLesson } from "@/domain/learning/english-a1/exercises";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";
import { isEnglishA1LessonUnlocked } from "@/domain/learning/english-a1/lesson-unlock";
import { ENGLISH_A1_MODULE_ID } from "@/domain/learning/english-a1/module.constants";
import { getLessonExerciseStats } from "@/services/learning/exercise-attempt.service";
import { getModuleProgress } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

type EnglishA1LessonTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function EnglishA1LessonTemplate({
  params,
}: EnglishA1LessonTemplateProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale, user] = await Promise.all([
    getTranslations("englishA1"),
    getLocale(),
    getCurrentUser(),
  ]);

  const moduleProgress = await getModuleProgress(
    user?.id ?? null,
    ENGLISH_A1_MODULE_ID,
  );
  const unlocked = isEnglishA1LessonUnlocked(slug, {
    isLoggedIn: moduleProgress.isLoggedIn,
    completedSlugs: moduleProgress.completedSlugs,
  });

  if (!unlocked) {
    return (
      <article className="flex flex-col gap-4">
        <Link href="/learn/english-a1" className="text-sm underline">
          {t("backToModule")}
        </Link>
        <p className="text-sm text-muted-foreground">{t("lessonLockedBody")}</p>
      </article>
    );
  }

  const exercises = getExercisesForLesson(slug);
  const stats = await getLessonExerciseStats(user?.id ?? null, slug);
  const { prev, next } = getAdjacentLessons(slug);

  return (
    <article className="flex flex-col gap-6">
      <Link href="/learn/english-a1" className="text-sm underline">
        {t("backToModule")}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("lessonNumber", { n: lesson.order + 1 })}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {lessonLocalizedText(locale, lesson.title)}
        </h1>
        <p className="text-muted-foreground">
          {lessonLocalizedText(locale, lesson.summary)}
        </p>
      </header>

      <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-5 dark:border-violet-900 dark:bg-violet-950/20">
        <h2 className="mb-2 text-base font-semibold">{t("grammarTitle")}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {lessonLocalizedText(locale, lesson.grammar)}
        </p>
      </section>

      <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900 dark:bg-sky-950/20">
        <h2 className="mb-2 text-base font-semibold">{t("tipTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {lessonLocalizedText(locale, lesson.tip)}
        </p>
      </section>

      <EnglishA1ExerciseSession
        exercises={exercises}
        lessonSlug={slug}
        locale={locale}
        isLoggedIn={Boolean(user)}
        initialCorrectIds={stats.correctExerciseIds}
        initialScorePercent={stats.scorePercent}
        lessonPassed={stats.passed}
      />

      <nav
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"
        aria-label={t("lessonNavLabel")}
      >
        {prev ? (
          <Link
            href={`/learn/english-a1/${prev.slug}`}
            className="text-sm font-medium underline"
          >
            ← {lessonLocalizedText(locale, prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/english-a1/${next.slug}`}
            className="text-sm font-medium underline"
          >
            {lessonLocalizedText(locale, next.title)} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
