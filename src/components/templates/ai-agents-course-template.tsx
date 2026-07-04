import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AiAgentsLessonList } from "@/components/molecules/ai-agents-lesson-list";
import { AiAgentsCertificateBanner } from "@/components/organisms/ai-agents-certificate-banner";
import { AiAgentsContinueLearning } from "@/components/organisms/ai-agents-continue-learning";
import { AiAgentsLeaderboard } from "@/components/organisms/ai-agents-leaderboard";
import { AiAgentsModuleProgress } from "@/components/organisms/ai-agents-module-progress";
import { AI_AGENTS_MODULE_ID } from "@/domain/learning/ai-agents/module.constants";
import {
  BUILD_YOUR_OWN_X_REPO,
  BUILD_YOUR_OWN_X_WEB,
  BYOX_AI_PICKS,
  BYOX_FULLSTACK_PICKS,
  byoxLocalizedText,
} from "@/domain/learning/byox-resources";
import {
  MICROSOFT_AI_AGENTS_REPO,
  MICROSOFT_AI_AGENTS_SHORT_URL,
} from "@/domain/learning/ai-agents/lesson.types";
import {
  getCertificateStatus,
  getModuleProgress,
  getNextLearningStep,
} from "@/services/learning/lesson-progress.service";
import { getLearningLeaderboard } from "@/services/learning/leaderboard.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function AiAgentsCourseTemplate() {
  const [t, locale, user] = await Promise.all([
    getTranslations("aiAgents"),
    getLocale(),
    getCurrentUser(),
  ]);
  const [progress, certificateStatus, nextStep, leaderboard] = await Promise.all([
    getModuleProgress(user?.id ?? null, AI_AGENTS_MODULE_ID),
    getCertificateStatus(user?.id ?? null, AI_AGENTS_MODULE_ID),
    getNextLearningStep(user?.id ?? null, AI_AGENTS_MODULE_ID),
    getLearningLeaderboard(user?.id ?? null),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <AiAgentsModuleProgress progress={progress} />
      <AiAgentsContinueLearning step={nextStep} />
      <AiAgentsCertificateBanner status={certificateStatus} />

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

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("byoxTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("byoxBody")}</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          <li>
            <a
              href={BUILD_YOUR_OWN_X_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("byoxIndexLink")}
            </a>
          </li>
          <li>
            <a
              href={BUILD_YOUR_OWN_X_WEB}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {t("byoxWebLink")}
            </a>
          </li>
        </ul>
        <h3 className="mb-2 mt-5 text-sm font-semibold">{t("byoxFullstackTitle")}</h3>
        <ul className="flex flex-col gap-3 text-sm">
          {BYOX_FULLSTACK_PICKS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {byoxLocalizedText(locale, item.title)}
              </a>
              <p className="text-muted-foreground">
                {byoxLocalizedText(locale, item.blurb)}
              </p>
            </li>
          ))}
        </ul>
        <h3 className="mb-2 mt-5 text-sm font-semibold">{t("byoxAiTitle")}</h3>
        <ul className="flex flex-col gap-3 text-sm">
          {BYOX_AI_PICKS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {byoxLocalizedText(locale, item.title)}
              </a>
              <p className="text-muted-foreground">
                {byoxLocalizedText(locale, item.blurb)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t("syllabusTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("syllabusHint")}</p>
        <AiAgentsLessonList
          completedSlugs={progress.completedSlugs}
          quizPassedSlugs={progress.quizPassedSlugs}
          isLoggedIn={progress.isLoggedIn}
        />
      </section>

      <AiAgentsLeaderboard entries={leaderboard} />

      <p className="text-xs text-muted-foreground">
        {t("attribution")}{" "}
        <Link href="/courses" className="underline">
          {t("backToCourses")}
        </Link>
      </p>
    </div>
  );
}
