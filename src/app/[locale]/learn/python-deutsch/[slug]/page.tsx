import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { PythonDeutschSectionTemplate } from "@/components/templates/python-deutsch-section-template";
import { DUAL_TRACK_SECTIONS } from "@/domain/learning/python-deutsch/track";

type PageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return DUAL_TRACK_SECTIONS.map((s) => ({ slug: s.slug }));
}

export default async function PythonDeutschSectionPage({ params }: PageProps) {
  const t = await getTranslations("pythonDeutsch");

  return (
    <LearnModuleShell
      title={t("title")}
      subtitle={t("subtitle")}
      badge={t("badge")}
    >
      <PythonDeutschSectionTemplate params={params} />
    </LearnModuleShell>
  );
}
