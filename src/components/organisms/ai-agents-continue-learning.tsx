import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Award, PartyPopper, Target } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getLessonBySlug } from "@/domain/learning/ai-agents/lessons";
import { lessonLocalizedText } from "@/domain/learning/ai-agents/lesson.types";
import type { NextStepVM } from "@/domain/learning/ai-agents/next-step";

type AiAgentsContinueLearningProps = {
  step: NextStepVM;
};

export async function AiAgentsContinueLearning({
  step,
}: AiAgentsContinueLearningProps) {
  const t = await getTranslations("aiAgents");
  const locale = await getLocale();

  if (step.type === "celebrate") {
    return (
      <section
        className="rounded-lg border border-primary/30 bg-primary/5 p-6"
        aria-labelledby="continue-learning-heading"
      >
        <div className="flex flex-wrap items-start gap-4">
          <PartyPopper className="size-8 shrink-0 text-primary" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id="continue-learning-heading" className="text-lg font-semibold">
              {t("continueCelebrateTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("continueCelebrateHint")}
            </p>
            <Link
              href="/learn/ai-agents/certificate"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium underline"
            >
              {t("certificateView")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (step.type === "certificate") {
    return (
      <section
        className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6"
        aria-labelledby="continue-learning-heading"
      >
        <div className="flex flex-wrap items-start gap-4">
          <Award className="size-8 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id="continue-learning-heading" className="text-lg font-semibold">
              {t("continueCertificateTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("continueCertificateHint")}
            </p>
            <Link
              href="/learn/ai-agents/certificate"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {t("certificateClaim")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const lesson = getLessonBySlug(step.slug);
  const title = lesson
    ? lessonLocalizedText(locale, lesson.title)
    : step.slug;

  const hintKey =
    step.focus === "missions"
      ? "continueMissionsHint"
      : step.focus === "quiz"
        ? "continueQuizHint"
        : "continueCompleteHint";

  return (
    <section
      className="rounded-lg border border-border bg-card p-6"
      aria-labelledby="continue-learning-heading"
    >
      <div className="flex flex-wrap items-start gap-4">
        <Target className="size-8 shrink-0 text-primary" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 id="continue-learning-heading" className="text-lg font-semibold">
            {t("continueTitle")}
          </h2>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{t(hintKey)}</p>
          <Link
            href={`/learn/ai-agents/${step.slug}`}
            className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("continueCta")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
