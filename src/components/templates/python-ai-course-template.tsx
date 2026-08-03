import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PythonAiLessonList } from "@/components/molecules/python-ai-lesson-list";
import { PythonAiModuleProgress } from "@/components/organisms/python-ai-module-progress";
import { PYTHON_AI_MODULE_ID } from "@/domain/learning/python-ai/module.constants";
import { getModuleProgress } from "@/services/learning/lesson-progress.service";
import { getCurrentUser } from "@/services/users/user.service";

export async function PythonAiCourseTemplate() {
  const [t, user] = await Promise.all([
    getTranslations("pythonAi"),
    getCurrentUser(),
  ]);
  const progress = await getModuleProgress(
    user?.id ?? null,
    PYTHON_AI_MODULE_ID,
  );

  return (
    <div className="flex flex-col gap-8">
      <PythonAiModuleProgress progress={progress} />

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{t("aboutPoint1")}</li>
          <li>{t("aboutPoint2")}</li>
          <li>{t("aboutPoint3")}</li>
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/learn/ai-agents" className="font-medium underline">
            {t("relatedAiAgents")}
          </Link>
          {" · "}
          <Link href="/learn/python-deutsch" className="font-medium underline">
            {t("relatedPythonDeutsch")}
          </Link>
        </p>
      </section>

      <section aria-labelledby="python-ai-lessons-heading">
        <h2 id="python-ai-lessons-heading" className="mb-4 text-lg font-semibold">
          {t("lessonsTitle")}
        </h2>
        <PythonAiLessonList
          completedSlugs={progress.completedSlugs}
          isLoggedIn={progress.isLoggedIn}
        />
      </section>
    </div>
  );
}
