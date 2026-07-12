import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPhaseBySlug } from "@/domain/learning/ai-practitioner-path/phases";
import { pathLocalizedText } from "@/domain/learning/ai-practitioner-path/path.types";
import { notFound } from "next/navigation";

type AiPractitionerPathPhaseTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function AiPractitionerPathPhaseTemplate({
  params,
}: AiPractitionerPathPhaseTemplateProps) {
  const { slug } = await params;
  const phase = getPhaseBySlug(slug);
  if (!phase) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("aiPractitionerPath"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link
          href="/learn/ai-practitioner-path"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToRoadmap")}
        </Link>
      </nav>

      <section className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {t("phaseLabel", { n: phase.order })}
          {phase.durationWeeks ? ` · ${phase.durationWeeks} ${t("weeksLabel")}` : ""}
        </p>
        <h2 className="mt-1 text-xl font-bold">
          {pathLocalizedText(locale, phase.title)}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {pathLocalizedText(locale, phase.summary)}
        </p>
        {phase.relatedHref && phase.relatedLabel ? (
          <Link
            href={phase.relatedHref}
            className="mt-4 inline-block text-sm font-medium text-emerald-700 underline dark:text-emerald-300"
          >
            {pathLocalizedText(locale, phase.relatedLabel)}
          </Link>
        ) : null}
      </section>

      <section aria-labelledby="steps-heading">
        <h3 id="steps-heading" className="mb-4 text-lg font-semibold">
          {t("stepsTitle")}
        </h3>
        <ol className="flex flex-col gap-4">
          {phase.steps.map((step) => (
            <li
              key={step.id}
              className="rounded-lg border border-border bg-card p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("stepLabel", { n: step.order })}
              </p>
              <h4 className="mt-1 font-semibold">
                {pathLocalizedText(locale, step.title)}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {pathLocalizedText(locale, step.body)}
              </p>
              {step.deliverable ? (
                <p className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-sm">
                  <span className="font-semibold">{t("deliverableLabel")}: </span>
                  {pathLocalizedText(locale, step.deliverable)}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
