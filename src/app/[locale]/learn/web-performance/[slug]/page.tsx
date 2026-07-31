import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { WebPerformanceLessonTemplate } from "@/components/templates/web-performance-lesson-template";
import { PERF_LESSONS } from "@/domain/web-performance/lessons";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return PERF_LESSONS.map((l) => ({ slug: l.slug }));
}

export default async function WebPerformanceLessonPage({ params }: PageProps) {
  const t = await getTranslations("webPerformance");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <WebPerformanceLessonTemplate params={params} />
    </LearnModuleShell>
  );
}
