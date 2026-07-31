import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Music, Bot, Gauge, Boxes, Languages } from "lucide-react";
import { CourseSearchForm } from "@/components/molecules/course-search-form";
import { CourseList } from "@/components/organisms/course-list";
import type { CourseVM } from "@/domain/courses/course.types";

type CoursesTemplateProps = {
  courses: CourseVM[];
  initialQuery: {
    q?: string;
    minHours?: number;
    location?: string;
  };
};

export async function CoursesTemplate({
  courses,
  initialQuery,
}: CoursesTemplateProps) {
  const t = await getTranslations("courses");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      <section
        aria-labelledby="featured-internal-heading"
        className="rounded-lg border border-violet-200 bg-violet-50 p-5 dark:border-violet-900 dark:bg-violet-950/30"
      >
        <h2 id="featured-internal-heading" className="text-lg font-semibold">
          {t("featuredInternalTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("featuredInternalBody")}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/learn/python-deutsch"
            className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              aria-hidden
            >
              <Languages className="size-4" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{t("featuredPythonDeutsch")}</span>
              <span className="text-sm text-muted-foreground">
                {t("featuredPythonDeutschHint")}
              </span>
            </span>
          </Link>
          <Link
            href="/sandbox/kit"
            className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200"
              aria-hidden
            >
              <Boxes className="size-4" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{t("featuredFullstackKit")}</span>
              <span className="text-sm text-muted-foreground">
                {t("featuredFullstackKitHint")}
              </span>
            </span>
          </Link>
          <Link
            href="/learn/web-performance"
            className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200"
              aria-hidden
            >
              <Gauge className="size-4" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{t("featuredWebPerformance")}</span>
              <span className="text-sm text-muted-foreground">
                {t("featuredWebPerformanceHint")}
              </span>
            </span>
          </Link>
          <Link
            href="/learn/ai-practitioner-path"
            className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              aria-hidden
            >
              <Bot className="size-4" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{t("featuredAiPractitionerPath")}</span>
              <span className="text-sm text-muted-foreground">
                {t("featuredAiPractitionerPathHint")}
              </span>
            </span>
          </Link>
          <Link
            href="/learn/songs-english"
            className="flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
              aria-hidden
            >
              <Music className="size-4" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{t("featuredSongsEnglish")}</span>
              <span className="text-sm text-muted-foreground">
                {t("featuredSongsEnglishHint")}
              </span>
            </span>
          </Link>
        </div>
      </section>

      <CourseSearchForm initialQuery={initialQuery} />
      <CourseList courses={courses} />
    </main>
  );
}
