import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { PythonDeutschCourseTemplate } from "@/components/templates/python-deutsch-course-template";

export default async function PythonDeutschCoursePage() {
  const t = await getTranslations("pythonDeutsch");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <PythonDeutschCourseTemplate />
    </LearnModuleShell>
  );
}
