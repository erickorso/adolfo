import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { htmlToText } from "@/lib/text";
import { getJobDetail } from "@/services/jobs/job.service";
import { listResumes } from "@/services/resume/resume.service";
import { getCurrentUser } from "@/services/users/user.service";
import { ResumeImprover } from "@/components/organisms/resume-improver";
import { TrackJobPostingForm } from "@/components/molecules/track-job-posting-form";

/**
 * Detalle de una vacante + asistente de IA para adaptar el CV.
 * Server Component: resuelve la oferta y, si hay sesión, los CVs del usuario.
 */
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobDetail(id);
  if (!job) {
    notFound();
  }

  const user = await getCurrentUser();
  const resumes = user ? await listResumes(user.id) : [];
  const t = await getTranslations("jobs");

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground">
          {job.company}
          {job.location ? ` · ${job.location}` : ""}
          {job.remote ? ` · ${t("remote")}` : ""}
        </p>
        <span className="text-xs text-muted-foreground">
          {t("posted", { date: formatDate(job.postedAt) })}
        </span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-2 w-fit",
          )}
        >
          {t("viewOfferOriginal")}
        </a>
        {user ? (
          <TrackJobPostingForm jobPostingId={job.id} source={job.source} />
        ) : null}
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{t("description")}</h2>
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {job.description ? htmlToText(job.description) : t("noDescription")}
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="text-xl font-semibold">{t("aiTitle")}</h2>
        {user ? (
          <ResumeImprover jobId={job.id} resumes={resumes} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="font-medium underline">
              {t("loginCta")}
            </Link>{" "}
            {t("loginToTailor")}
          </p>
        )}
      </section>
    </main>
  );
}
