import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AiAgentsLessonList } from "@/components/molecules/ai-agents-lesson-list";
import {
  MICROSOFT_AI_AGENTS_REPO,
  MICROSOFT_AI_AGENTS_SHORT_URL,
} from "@/domain/learning/ai-agents/lesson.types";

export async function AiAgentsCourseTemplate() {
  const t = await getTranslations("aiAgents");

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          <li>
            <a
              href={MICROSOFT_AI_AGENTS_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("repoLink")}
            </a>
          </li>
          <li>
            <a
              href={MICROSOFT_AI_AGENTS_SHORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("shortUrlLink")}
            </a>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t("syllabusTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("syllabusHint")}</p>
        <AiAgentsLessonList />
      </section>

      <p className="text-xs text-muted-foreground">
        {t("attribution")}{" "}
        <Link href="/courses" className="underline">
          {t("backToCourses")}
        </Link>
      </p>
    </div>
  );
}
