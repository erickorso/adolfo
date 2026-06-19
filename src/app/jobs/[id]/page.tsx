import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { htmlToText } from "@/lib/text";
import { getJobDetail } from "@/services/jobs/job.service";
import { listResumes } from "@/services/resume/resume.service";
import { getCurrentUser } from "@/services/users/user.service";
import { ResumeImprover } from "@/components/organisms/resume-improver";

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

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground">
          {job.company}
          {job.location ? ` · ${job.location}` : ""}
          {job.remote ? " · Remoto" : ""}
        </p>
        <span className="text-xs text-muted-foreground">
          Publicado: {formatDate(job.postedAt)}
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
          Ver oferta original
        </a>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Descripción</h2>
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {job.description ? htmlToText(job.description) : "Sin descripción."}
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="text-xl font-semibold">Asistente de CV (IA)</h2>
        {user ? (
          <ResumeImprover jobId={job.id} resumes={resumes} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="font-medium underline">
              Iniciá sesión
            </Link>{" "}
            para adaptar tu CV a esta oferta.
          </p>
        )}
      </section>
    </main>
  );
}
