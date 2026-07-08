import { getLocale, getTranslations } from "next-intl/server";
import { AiAgentsLessonTemplate } from "@/components/templates/ai-agents-lesson-template";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { AI_AGENTS_LESSONS, getLessonBySlug } from "@/domain/learning/ai-agents/lessons";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";

type AiAgentsLessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return AI_AGENTS_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export default async function AiAgentsLessonPage({ params }: AiAgentsLessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  const t = await getTranslations("aiAgents");
  const locale = await getLocale();
  const title = lesson
    ? lessonLocalizedText(locale, lesson.title)
    : t("title");

  return (
    <LearnModuleShell
      title={title}
      subtitle={lesson ? lessonLocalizedText(locale, lesson.summary) : undefined}
      badge={t("badge")}
    >
      <AiAgentsLessonTemplate params={params} />
    </LearnModuleShell>
  );
}
