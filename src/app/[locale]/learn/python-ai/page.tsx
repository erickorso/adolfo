import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { PythonAiCourseTemplate } from "@/components/templates/python-ai-course-template";

export default async function PythonAiCoursePage() {
  const t = await getTranslations("pythonAi");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <PythonAiCourseTemplate />
    </LearnModuleShell>
  );
}
