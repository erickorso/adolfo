import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { EnglishA1LessonTemplate } from "@/components/templates/english-a1-lesson-template";
import { getLessonBySlug } from "@/domain/learning/english-a1/lessons";
import { lessonLocalizedText } from "@/domain/learning/english-a1/lesson.types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EnglishA1LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("englishA1"),
    getLocale(),
  ]);

  return (
    <LearnModuleShell
      title={lessonLocalizedText(locale, lesson.title)}
      subtitle={lessonLocalizedText(locale, lesson.summary)}
      badge={`${t("badge")} · ${t("lessonNumber", { n: lesson.order + 1 })}`}
      wide
    >
      <EnglishA1LessonTemplate params={params} />
    </LearnModuleShell>
  );
}
