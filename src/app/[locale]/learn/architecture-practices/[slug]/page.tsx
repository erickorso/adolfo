import { getTranslations, getLocale } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { ArchitecturePracticesLessonTemplate } from "@/components/templates/architecture-practices-lesson-template";
import {
  ARCHITECTURE_PRACTICES_LESSONS,
  getLessonBySlug,
} from "@/domain/learning/architecture-practices/lessons";
import { lessonLocalizedText } from "@/domain/learning/architecture-practices/lesson.types";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ARCHITECTURE_PRACTICES_LESSONS.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function ArchitecturePracticesLessonPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("architecturePractices"),
    getLocale(),
  ]);

  return (
    <LearnModuleShell
      title={lessonLocalizedText(locale, lesson.title)}
      subtitle={lessonLocalizedText(locale, lesson.summary)}
      badge={t("badge")}
    >
      <ArchitecturePracticesLessonTemplate params={params} />
    </LearnModuleShell>
  );
}
