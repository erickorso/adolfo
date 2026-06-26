import { getTranslations } from "next-intl/server";
import { CourseCard } from "@/components/molecules/course-card";
import type { CourseVM } from "@/domain/courses/course.types";

type CourseListProps = {
  courses: CourseVM[];
};

export async function CourseList({ courses }: CourseListProps) {
  const t = await getTranslations("courses");

  if (courses.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {courses.map((course) => (
        <li key={course.id} className="flex">
          <div className="w-full">
            <CourseCard course={course} />
          </div>
        </li>
      ))}
    </ul>
  );
}
