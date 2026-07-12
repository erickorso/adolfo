import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Bot, ChevronRight, Clock, Target } from "lucide-react";
import { AI_PRACTITIONER_PHASES } from "@/domain/learning/ai-practitioner-path/phases";
import { pathLocalizedText } from "@/domain/learning/ai-practitioner-path/path.types";

export async function AiPractitionerPathCourseTemplate() {
  const [t, locale] = await Promise.all([
    getTranslations("aiPractitionerPath"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
        <p className="mt-3 text-sm text-muted-foreground">{t("horizonHint")}</p>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("originalRoadmapTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("originalRoadmapBody")}</p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {(t.raw("originalRoadmapItems") as string[]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="phases-heading">
        <h2 id="phases-heading" className="mb-4 text-lg font-semibold">
          {t("phasesTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {AI_PRACTITIONER_PHASES.map((phase) => (
            <li key={phase.slug}>
              <Link
                href={`/learn/ai-practitioner-path/${phase.slug}`}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  aria-hidden
                >
                  <Bot className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-semibold">
                    {pathLocalizedText(locale, phase.title)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pathLocalizedText(locale, phase.summary)}
                  </span>
                  <span className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden />
                      {phase.durationWeeks} {t("weeksLabel")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="size-3.5" aria-hidden />
                      {phase.steps.length} {t("stepsLabel")}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  className="mt-1 size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("relatedTitle")}</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <Link href="/learn/ai-agents" className="font-medium underline">
              {t("relatedAiAgents")}
            </Link>
          </li>
          <li>
            <span className="text-muted-foreground">{t("relatedPlanHint")}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
