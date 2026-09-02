import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { EnglishA1LessonClient } from "@/components/organisms/english-a1-lesson-client";
import type { CompletedLessonNote } from "@/components/organisms/english-a1-lessons-notes-sidebar";
import {
  getAdjacentLessons,
  getLessonBySlug,
  ENGLISH_A1_LESSONS,
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

async function getCompletedLessonNotes(
  userId: string | null,
  locale: string,
  currentSlug: string,
): Promise<CompletedLessonNote[]> {
  if (!userId) {
    return [];
  }

  const completedSlugs = (
    await getModuleProgress(userId, ENGLISH_A1_MODULE_ID)
  ).completedSlugs;

  const lessons = ENGLISH_A1_LESSONS.filter((lesson) =>
    completedSlugs.includes(lesson.slug),
  ).sort((a, b) => a.order - b.order);

  const stats = await Promise.all(
    lessons.map((lesson) => getLessonExerciseStats(userId, lesson.slug)),
  );

  return lessons.map((lesson, index) => ({
    slug: lesson.slug,
    order: lesson.order,
    title: lessonLocalizedText(locale, lesson.title),
    grammar: lessonLocalizedText(locale, lesson.grammar),
    scorePercent: stats[index]?.scorePercent ?? 0,
    isCurrent: lesson.slug === currentSlug,
  }));
}

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

  const [exercises, stats, completedLessons, { prev, next }] =
    await Promise.all([
      Promise.resolve(getExercisesForLesson(slug)),
      getLessonExerciseStats(user?.id ?? null, slug),
      getCompletedLessonNotes(user?.id ?? null, locale, slug),
      Promise.resolve(getAdjacentLessons(slug)),
    ]);

  return (
    <article className="flex flex-col gap-6">
      <Link href="/learn/english-a1" className="text-sm underline">
        {t("backToModule")}
      </Link>

      <EnglishA1LessonClient
        lesson={lesson}
        locale={locale}
        exercises={exercises}
        lessonSlug={slug}
        isLoggedIn={Boolean(user)}
        initialCorrectIds={stats.correctExerciseIds}
        initialScorePercent={stats.scorePercent}
        lessonPassed={stats.passed}
        tipTitle={t("tipTitle")}
        grammarTitle={t("grammarTitle")}
        completedLessons={completedLessons}
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
