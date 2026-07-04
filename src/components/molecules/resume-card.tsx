import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/bytes";
import {
  deleteResumeAction,
  setDefaultResumeAction,
} from "@/app/[locale]/account/cvs/actions";
import type { ResumeVM } from "@/domain/resume/resume.types";

type ResumeCardProps = {
  resume: ResumeVM;
};

/**
 * Molécula: tarjeta de un CV. Las acciones (default/eliminar) son formularios
 * que postean a Server Actions — sin lógica de cliente.
 */
export async function ResumeCard({ resume }: ResumeCardProps) {
  const t = await getTranslations("cvs");
  const kind = resume.mimeType === "application/pdf" ? "PDF" : "DOCX";

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{resume.label}</span>
          {resume.isDefault ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {t("default")}
            </span>
          ) : null}
        </div>
        <span className="text-xs text-muted-foreground">
          {kind} · {formatBytes(resume.sizeBytes)} ·{" "}
          {resume.hasText ? t("textReady") : t("noText")}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`/api/resumes/${resume.id}/file`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {t("view")}
        </a>
        {!resume.isDefault ? (
          <form action={setDefaultResumeAction}>
            <input type="hidden" name="resumeId" value={resume.id} />
            <Button type="submit" variant="ghost" size="sm">
              {t("makeDefault")}
            </Button>
          </form>
        ) : null}
        <form action={deleteResumeAction}>
          <input type="hidden" name="resumeId" value={resume.id} />
          <Button type="submit" variant="ghost" size="sm">
            {t("delete")}
          </Button>
        </form>
      </div>
    </div>
  );
}
