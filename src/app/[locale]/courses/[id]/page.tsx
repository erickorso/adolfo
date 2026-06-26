import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CourseEnrollButton } from "@/components/molecules/course-enroll-button";
import { getCurrentUser } from "@/services/users/user.service";
import {
  getCourseDetail,
  isUserEnrolled,
} from "@/services/courses/course.service";

type CourseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await getCourseDetail(id);
  if (!course) {
    notFound();
  }

  const t = await getTranslations("courses");
  const user = await getCurrentUser();
  const enrolled = user ? await isUserEnrolled(user.id, course.id) : false;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Link href="/courses" className="text-sm text-muted-foreground underline">
        {t("backToList")}
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">{course.provider}</p>
      </header>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-muted-foreground">{t("hours")}</dt>
        <dd>
          {course.hours} {t("hoursUnit")}
        </dd>
        <dt className="font-medium text-muted-foreground">{t("modality")}</dt>
        <dd>{course.modality}</dd>
        {course.location ? (
          <>
            <dt className="font-medium text-muted-foreground">{t("location")}</dt>
            <dd>{course.location}</dd>
          </>
        ) : null}
        {course.sector ? (
          <>
            <dt className="font-medium text-muted-foreground">{t("sector")}</dt>
            <dd>{course.sector}</dd>
          </>
        ) : null}
        {course.targetAudience ? (
          <>
            <dt className="font-medium text-muted-foreground">{t("audience")}</dt>
            <dd>{course.targetAudience}</dd>
          </>
        ) : null}
      </dl>
      {course.description ? (
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("description")}</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {course.description}
          </p>
        </section>
      ) : null}
      <CourseEnrollButton
        courseId={course.id}
        enrolled={enrolled}
        externalUrl={course.url}
      />
    </main>
  );
}
