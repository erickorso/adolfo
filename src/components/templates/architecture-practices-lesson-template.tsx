import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { LessonCompleteButton } from "@/components/molecules/lesson-complete-button";
import {
  getAdjacentLessons,
  getLessonBySlug,
} from "@/domain/learning/architecture-practices/lessons";
import { isArchitecturePracticesLessonUnlocked } from "@/domain/learning/architecture-practices/lesson-unlock";
import { lessonLocalizedText } from "@/domain/learning/architecture-practices/lesson.types";
import { ARCHITECTURE_PRACTICES_MODULE_ID } from "@/domain/learning/architecture-practices/module.constants";
import {
  getLessonProgressState,
  getModuleProgress,
} from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

type ArchitecturePracticesLessonTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function ArchitecturePracticesLessonTemplate({
  params,
}: ArchitecturePracticesLessonTemplateProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale, user] = await Promise.all([
    getTranslations("architecturePractices"),
    getLocale(),
    getCurrentUser(),
  ]);
  const moduleProgress = await getModuleProgress(
    user?.id ?? null,
    ARCHITECTURE_PRACTICES_MODULE_ID,
  );
  const unlocked = isArchitecturePracticesLessonUnlocked(slug, {
    isLoggedIn: moduleProgress.isLoggedIn,
    completedSlugs: moduleProgress.completedSlugs,
  });

  if (!unlocked) {
    return (
      <article className="flex flex-col gap-4">
        <Link href="/learn/architecture-practices" className="text-sm underline">
          {t("backToModule")}
        </Link>
        <p className="text-sm text-muted-foreground">{t("lessonLockedBody")}</p>
      </article>
    );
  }

  const progressState = await getLessonProgressState(
    user?.id ?? null,
    ARCHITECTURE_PRACTICES_MODULE_ID,
    slug,
  );
  const { prev, next } = getAdjacentLessons(slug);

  return (
    <article className="flex flex-col gap-6">
      <Link href="/learn/architecture-practices" className="text-sm underline">
        {t("backToModule")}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("lessonNumber", { n: lesson.order })} · {lesson.hours}h
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {lessonLocalizedText(locale, lesson.title)}
        </h1>
        <p className="text-muted-foreground">
          {lessonLocalizedText(locale, lesson.summary)}
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-2 text-base font-semibold">{t("contentTitle")}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {lessonLocalizedText(locale, lesson.body)}
        </p>
        {lesson.bullets?.length ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {lesson.bullets.map((b) => (
              <li key={b.en}>{lessonLocalizedText(locale, b)}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-lg border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-900 dark:bg-teal-950/20">
        <h2 className="mb-2 text-base font-semibold">{t("deliverableTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {lessonLocalizedText(locale, lesson.deliverable)}
        </p>
      </section>

      {lesson.resources?.length ? (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-3 text-base font-semibold">{t("resourcesTitle")}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {lesson.resources.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    r.href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="font-medium underline"
                >
                  {lessonLocalizedText(locale, r.label)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <LessonCompleteButton
        moduleId={ARCHITECTURE_PRACTICES_MODULE_ID}
        lessonSlug={slug}
        completed={progressState.completed}
        isLoggedIn={Boolean(user)}
        progressBasePath="/learn/architecture-practices"
        i18nNamespace="architecturePractices"
      />

      <nav
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"
        aria-label={t("lessonNavLabel")}
      >
        {prev ? (
          <Link
            href={`/learn/architecture-practices/${prev.slug}`}
            className="text-sm font-medium underline"
          >
            ← {lessonLocalizedText(locale, prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/architecture-practices/${next.slug}`}
            className="text-sm font-medium underline"
          >
            {lessonLocalizedText(locale, next.title)} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
