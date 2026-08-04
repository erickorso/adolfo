import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArchitecturePracticesLessonList } from "@/components/molecules/architecture-practices-lesson-list";
import { ArchitecturePracticesModuleProgress } from "@/components/organisms/architecture-practices-module-progress";
import { ARCHITECTURE_PRACTICES_MODULE_ID } from "@/domain/learning/architecture-practices/module.constants";
import { getModuleProgress } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function ArchitecturePracticesCourseTemplate() {
  const [t, user] = await Promise.all([
    getTranslations("architecturePractices"),
    getCurrentUser(),
  ]);
  const progress = await getModuleProgress(
    user?.id ?? null,
    ARCHITECTURE_PRACTICES_MODULE_ID,
  );

  return (
    <div className="flex flex-col gap-8">
      <ArchitecturePracticesModuleProgress progress={progress} />

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("aboutPoint1")}</li>
          <li>{t("aboutPoint2")}</li>
          <li>{t("aboutPoint3")}</li>
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/learn/python-ai" className="font-medium underline">
            {t("relatedPythonAi")}
          </Link>
          {" · "}
          <Link href="/sandbox/kit" className="font-medium underline">
            {t("relatedKit")}
          </Link>
        </p>
      </section>

      <section aria-labelledby="architecture-practices-lessons-heading">
        <h2
          id="architecture-practices-lessons-heading"
          className="mb-4 text-lg font-semibold"
        >
          {t("lessonsTitle")}
        </h2>
        <ArchitecturePracticesLessonList
          completedSlugs={progress.completedSlugs}
          isLoggedIn={progress.isLoggedIn}
        />
      </section>
    </div>
  );
}
