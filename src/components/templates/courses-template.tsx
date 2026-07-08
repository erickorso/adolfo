import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Music } from "lucide-react";
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
        <Link
          href="/learn/songs-english"
          className="mt-4 flex items-start gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/50"
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
      </section>

      <CourseSearchForm initialQuery={initialQuery} />
      <CourseList courses={courses} />
    </main>
  );
}
