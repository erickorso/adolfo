import { AiAgentsLessonTemplate } from "@/components/templates/ai-agents-lesson-template";
import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";

type AiAgentsLessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return AI_AGENTS_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export default async function AiAgentsLessonPage({ params }: AiAgentsLessonPageProps) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <AiAgentsLessonTemplate params={params} />
    </main>
  );
}
