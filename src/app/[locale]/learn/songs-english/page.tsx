import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { SongsEnglishCourseTemplate } from "@/components/templates/songs-english-course-template";

export default async function SongsEnglishCoursePage() {
  const t = await getTranslations("songsEnglish");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <SongsEnglishCourseTemplate />
    </LearnModuleShell>
  );
}
