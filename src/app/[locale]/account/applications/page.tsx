import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ApplicationsManager } from "@/components/organisms/applications-manager";
import {
  getJobApplicationStats,
  listUserJobApplications,
} from "@/services/job-applications/job-application.service";
import { getCurrentUser } from "@/services/users/user.service";

/** Pipeline de postulaciones del usuario autenticado. */
export default async function AccountApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/applications`);
  }

  const [applications, stats] = await Promise.all([
    listUserJobApplications(user.id),
    getJobApplicationStats(user.id),
  ]);
  const t = await getTranslations("applications");

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/account"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToAccount")}
        </Link>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ApplicationsManager applications={applications} stats={stats} />
    </main>
  );
}
