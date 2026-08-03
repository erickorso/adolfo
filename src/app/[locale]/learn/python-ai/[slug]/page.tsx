import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { PythonAiLessonTemplate } from "@/components/templates/python-ai-lesson-template";
import { getLessonBySlug } from "@/domain/learning/python-ai/lessons";
import { lessonLocalizedText } from "@/domain/learning/python-ai/lesson.types";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PythonAiLessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("pythonAi"),
    getLocale(),
  ]);

  return (
    <LearnModuleShell
      title={lessonLocalizedText(locale, lesson.title)}
      subtitle={lessonLocalizedText(locale, lesson.summary)}
      badge={t("badge")}
    >
      <PythonAiLessonTemplate params={params} />
    </LearnModuleShell>
  );
}
