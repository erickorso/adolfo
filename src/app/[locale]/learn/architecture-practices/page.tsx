import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { ArchitecturePracticesCourseTemplate } from "@/components/templates/architecture-practices-course-template";

export default async function ArchitecturePracticesCoursePage() {
  const t = await getTranslations("architecturePractices");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <ArchitecturePracticesCourseTemplate />
    </LearnModuleShell>
  );
}
