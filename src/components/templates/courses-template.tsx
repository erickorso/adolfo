import { getTranslations } from "next-intl/server";
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
      <CourseSearchForm initialQuery={initialQuery} />
      <CourseList courses={courses} />
    </main>
  );
}
