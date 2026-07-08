import { getTranslations } from "next-intl/server";
import { AiAgentsCourseTemplate } from "@/components/templates/ai-agents-course-template";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";

export default async function AiAgentsCoursePage() {
  const t = await getTranslations("aiAgents");

  return (
    <LearnModuleShell title={t("title")} subtitle={t("subtitle")} badge={t("badge")}>
      <AiAgentsCourseTemplate />
    </LearnModuleShell>
  );
}
