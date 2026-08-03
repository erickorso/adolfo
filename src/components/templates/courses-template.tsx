import { getTranslations } from "next-intl/server";
import { CourseSearchForm } from "@/components/molecules/course-search-form";
import { CourseList } from "@/components/organisms/course-list";
import { CoursesFeaturedModules } from "@/components/organisms/courses-featured-modules";
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

  const modules = [
    {
      href: "/learn/python-deutsch",
      title: t("featuredPythonDeutsch"),
      hint: t("featuredPythonDeutschHint"),
      icon: "languages" as const,
      iconClass:
        "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    },
    {
      href: "/learn/python-ai",
      title: t("featuredPythonAi"),
      hint: t("featuredPythonAiHint"),
      icon: "bot" as const,
      iconClass:
        "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-200",
    },
    {
      href: "/sandbox/kit",
      title: t("featuredFullstackKit"),
      hint: t("featuredFullstackKitHint"),
      body: t("featuredFullstackKitBody"),
      icon: "boxes" as const,
      iconClass:
        "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
    },
    {
      href: "/learn/web-performance",
      title: t("featuredWebPerformance"),
      hint: t("featuredWebPerformanceHint"),
      icon: "gauge" as const,
      iconClass: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    },
    {
      href: "/learn/ai-practitioner-path",
      title: t("featuredAiPractitionerPath"),
      hint: t("featuredAiPractitionerPathHint"),
      icon: "bot" as const,
      iconClass:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    },
    {
      href: "/courses/fp",
      title: t("featuredFp"),
      hint: t("featuredFpHint"),
      icon: "graduation" as const,
      iconClass: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
    },
    {
      href: "/learn/songs-english",
      title: t("featuredSongsEnglish"),
      hint: t("featuredSongsEnglishHint"),
      icon: "music" as const,
      iconClass:
        "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200",
    },
  ];

  const gravityChips = [
    { id: "fp", label: t("gravityChipFp") },
    { id: "jobs", label: t("gravityChipJobs") },
    { id: "ai", label: t("gravityChipAi") },
    { id: "kit", label: t("gravityChipKit") },
    { id: "cwv", label: t("gravityChipCwv") },
    { id: "songs", label: t("gravityChipSongs") },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      <CoursesFeaturedModules
        sectionTitle={t("featuredInternalTitle")}
        sectionBody={t("featuredInternalBody")}
        gravityTitle={t("gravityTitle")}
        gravityHint={t("gravityHint")}
        gravityAria={t("gravityAria")}
        modules={modules}
        gravityChips={gravityChips}
      />

      <CourseSearchForm initialQuery={initialQuery} />
      <CourseList courses={courses} />
    </main>
  );
}
