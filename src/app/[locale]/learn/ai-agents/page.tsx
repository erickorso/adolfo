import { getTranslations } from "next-intl/server";
import { AiAgentsCourseTemplate } from "@/components/templates/ai-agents-course-template";

export default async function AiAgentsCoursePage() {
  const t = await getTranslations("aiAgents");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>
      <AiAgentsCourseTemplate />
    </main>
  );
}
