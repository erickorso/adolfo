import { getLocale, getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { AiPractitionerPathPhaseTemplate } from "@/components/templates/ai-practitioner-path-phase-template";
import {
  AI_PRACTITIONER_PHASES,
  getPhaseBySlug,
} from "@/domain/learning/ai-practitioner-path/phases";
import { pathLocalizedText } from "@/domain/learning/ai-practitioner-path/path.types";

type AiPractitionerPathPhasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return AI_PRACTITIONER_PHASES.map((phase) => ({ slug: phase.slug }));
}

export default async function AiPractitionerPathPhasePage({
  params,
}: AiPractitionerPathPhasePageProps) {
  const { slug } = await params;
  const phase = getPhaseBySlug(slug);
  const [t, locale] = await Promise.all([
    getTranslations("aiPractitionerPath"),
    getLocale(),
  ]);

  return (
    <LearnModuleShell
      title={phase ? pathLocalizedText(locale, phase.title) : t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <AiPractitionerPathPhaseTemplate params={params} />
    </LearnModuleShell>
  );
}
