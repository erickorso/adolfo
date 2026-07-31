import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { WebPerformanceCourseTemplate } from "@/components/templates/web-performance-course-template";

export default async function WebPerformanceCoursePage() {
  const t = await getTranslations("webPerformance");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <WebPerformanceCourseTemplate />
    </LearnModuleShell>
  );
}
