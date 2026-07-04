import { getTranslations } from "next-intl/server";
import { MotionLabCatalogBg } from "@/components/organisms/motion-lab-catalog-bg";
import { MotionLabPageClient } from "@/components/templates/motion-lab-page-client";

export default async function MotionLabPage() {
  const t = await getTranslations("motionLab");

  return (
    <>
      <MotionLabCatalogBg />
      <main className="motion-lab-main" aria-label={t("title")}>
        <MotionLabPageClient />
      </main>
    </>
  );
}
