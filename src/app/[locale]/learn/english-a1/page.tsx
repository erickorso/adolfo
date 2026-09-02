import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { EnglishA1CourseTemplate } from "@/components/templates/english-a1-course-template";

export default async function EnglishA1CoursePage() {
  const t = await getTranslations("englishA1");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <EnglishA1CourseTemplate />
    </LearnModuleShell>
  );
}
