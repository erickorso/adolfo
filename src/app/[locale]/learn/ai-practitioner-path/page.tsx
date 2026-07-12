import { getTranslations } from "next-intl/server";
import { AiPractitionerPathCourseTemplate } from "@/components/templates/ai-practitioner-path-course-template";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";

export default async function AiPractitionerPathPage() {
  const t = await getTranslations("aiPractitionerPath");

  return (
    <LearnModuleShell title={t("title")} subtitle={t("subtitle")} badge={t("badge")}>
      <AiPractitionerPathCourseTemplate />
    </LearnModuleShell>
  );
}
