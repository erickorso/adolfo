import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/services/users/user.service";
import { listUserEnrollments } from "@/services/courses/course.service";

export default async function AccountCoursesPage() {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/courses`);
  }

  const t = await getTranslations("courses");
  const enrollments = await listUserEnrollments(user.id);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t("myCourses")}</h1>
        <Link href="/courses" className="text-sm font-medium underline">
          {t("browse")}
        </Link>
      </div>
      {enrollments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("myEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {enrollments.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <Link
                href={`/courses/${entry.course.id}`}
                className="font-medium hover:underline"
              >
                {entry.course.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {entry.course.provider} · {entry.course.hours} {t("hoursUnit")}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("registeredAt", {
                  date: entry.enrolledAt.toLocaleDateString("es-ES"),
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
