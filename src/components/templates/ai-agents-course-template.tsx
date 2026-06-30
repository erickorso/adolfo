import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AiAgentsLessonList } from "@/components/molecules/ai-agents-lesson-list";
import { AiAgentsModuleProgress } from "@/components/organisms/ai-agents-module-progress";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import {
  MICROSOFT_AI_AGENTS_REPO,
  MICROSOFT_AI_AGENTS_SHORT_URL,
} from "@/domain/learning/ai-agents/lesson.types";
import { getModuleProgress } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function AiAgentsCourseTemplate() {
  const t = await getTranslations("aiAgents");
  const user = await getCurrentUser();
  const progress = await getModuleProgress(user?.id ?? null, AI_AGENTS_MODULE_ID);

  return (
    <div className="flex flex-col gap-8">
      <AiAgentsModuleProgress progress={progress} />

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
        <AiAgentsLessonList
          completedSlugs={progress.completedSlugs}
          quizPassedSlugs={progress.quizPassedSlugs}
        />
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
