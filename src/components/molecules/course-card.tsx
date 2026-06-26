import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CourseVM } from "@/domain/courses/course.types";

type CourseCardProps = {
  course: CourseVM;
};

export async function CourseCard({ course }: CourseCardProps) {
  const t = await getTranslations("courses");

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold">
        <Link href={`/courses/${course.id}`} className="hover:underline">
          {course.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{course.provider}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <div>
          <dt className="sr-only">{t("hours")}</dt>
          <dd>
            {course.hours} {t("hoursUnit")}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t("modality")}</dt>
          <dd>{course.modality}</dd>
        </div>
        {course.location ? (
          <div className="col-span-2">
            <dt className="sr-only">{t("location")}</dt>
            <dd>{course.location}</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {course.free ? t("free") : t("paid")}
        </span>
        <Link
          href={`/courses/${course.id}`}
          className="text-sm font-medium underline"
        >
          {t("viewDetail")}
        </Link>
      </div>
    </article>
  );
}
