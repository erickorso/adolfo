import { getTranslations } from "next-intl/server";
import { MotionLabPageClient } from "@/components/templates/motion-lab-page-client";

export default async function MotionLabPage() {
  const t = await getTranslations("motionLab");

  return (
    <main aria-label={t("title")}>
      <MotionLabPageClient />
    </main>
  );
}
