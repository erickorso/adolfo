import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WebPerformanceDashboard } from "@/components/organisms/web-performance-dashboard";
import {
  PERF_LESSONS,
  localized,
} from "@/domain/web-performance/lessons";

export async function WebPerformanceCourseTemplate() {
  const [t, locale] = await Promise.all([
    getTranslations("webPerformance"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-labelledby="about-perf-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <h2 id="about-perf-heading" className="text-lg font-semibold">
          {t("aboutTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("aboutBody")}</p>
      </section>

      <WebPerformanceDashboard />

      <section aria-labelledby="lessons-heading" className="flex flex-col gap-4">
        <h2 id="lessons-heading" className="text-xl font-semibold">
          {t("lessonsTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {PERF_LESSONS.map((lesson) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/web-performance/${lesson.slug}`}
                className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("lessonLabel", { n: lesson.order })}
                </span>
                <span className="font-medium">
                  {localized(locale, lesson.title)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {localized(locale, lesson.summary)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
