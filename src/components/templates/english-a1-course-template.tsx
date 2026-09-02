import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EnglishA1LessonList } from "@/components/molecules/english-a1-lesson-list";
import { EnglishA1ModuleProgress } from "@/components/organisms/english-a1-module-progress";
import { ENGLISH_A1_MODULE_ID } from "@/domain/learning/english-a1/module.constants";
import { getModuleProgress } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function EnglishA1CourseTemplate() {
  const [t, user] = await Promise.all([
    getTranslations("englishA1"),
    getCurrentUser(),
  ]);
  const progress = await getModuleProgress(
    user?.id ?? null,
    ENGLISH_A1_MODULE_ID,
  );

  return (
    <div className="flex flex-col gap-8">
      <EnglishA1ModuleProgress progress={progress} />

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("aboutPoint1")}</li>
          <li>{t("aboutPoint2")}</li>
          <li>{t("aboutPoint3")}</li>
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/learn/songs-english" className="font-medium underline">
            {t("relatedSongs")}
          </Link>
        </p>
      </section>

      <section aria-labelledby="english-a1-lessons-heading">
        <h2
          id="english-a1-lessons-heading"
          className="mb-4 text-lg font-semibold"
        >
          {t("lessonsTitle")}
        </h2>
        <EnglishA1LessonList
          completedSlugs={progress.completedSlugs}
          isLoggedIn={progress.isLoggedIn}
        />
      </section>
    </div>
  );
}
