import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import type { JobVM } from "@/domain/jobs/job.types";

type JobCardProps = {
  job: JobVM;
};

/**
 * Molécula: tarjeta de una vacante. Presentacional (recibe un JobVM).
 * El enlace a la oferta abre la fuente original en una pestaña nueva.
 */
export function JobCard({ job }: JobCardProps) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium">
          <Link href={`/jobs/${job.id}`} className="hover:underline">
            {job.title}
          </Link>
        </h3>
        {job.remote ? (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
            Remoto
          </span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        {job.company}
        {job.location ? ` · ${job.location}` : ""}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDate(job.postedAt)}
        </span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Ver oferta
        </a>
      </div>
    </article>
  );
}
