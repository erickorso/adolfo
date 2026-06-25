import { Link } from "@/i18n/navigation";
import { redirect, notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { ApplicationDetailForm } from "@/components/organisms/application-detail-form";
import { ApplicationProgress } from "@/components/organisms/application-progress";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { getJobApplicationDetail } from "@/services/job-applications/job-application.service";
import { getCurrentUser } from "@/services/users/user.service";

/** Detalle de una postulación con progreso y edición. */
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/applications`);
  }

  const { id } = await params;
  const application = await getJobApplicationDetail(user.id, id);
  if (!application) {
    notFound();
  }

  const t = await getTranslations("applications");

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/account/applications"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToBoard")}
        </Link>
        <h1 className="text-2xl font-semibold">{application.company}</h1>
        <p className="text-muted-foreground">{application.title}</p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {application.source ? <span>{application.source}</span> : null}
          {application.appliedAt ? (
            <span>
              {t("appliedAt")}: {formatDate(application.appliedAt)}
            </span>
          ) : null}
        </div>
        {application.url ? (
          <a
            href={application.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
          >
            {t("viewOffer")}
          </a>
        ) : null}
      </div>

      <ApplicationProgress application={application} />
      <ApplicationDetailForm
        application={{
          id: application.id,
          status: application.status,
          nextStep: application.nextStep,
          notes: application.notes,
        }}
      />
    </main>
  );
}
