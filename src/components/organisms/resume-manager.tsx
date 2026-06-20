import { getTranslations } from "next-intl/server";
import { ResumeCard } from "@/components/molecules/resume-card";
import { ResumeUploadForm } from "@/components/molecules/resume-upload-form";
import { MAX_RESUMES } from "@/services/resume/resume.policy";
import type { ResumeVM } from "@/domain/resume/resume.types";

type ResumeManagerProps = {
  resumes: ResumeVM[];
};

/**
 * Organismo: gestión de CVs (hasta MAX_RESUMES). Lista + formulario de subida.
 */
export async function ResumeManager({ resumes }: ResumeManagerProps) {
  const t = await getTranslations("cvs");
  const atLimit = resumes.length >= MAX_RESUMES;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {resumes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
        )}
      </div>

      <div className="rounded-lg border border-dashed border-input p-4">
        <h2 className="mb-3 text-sm font-semibold">
          {t("uploadTitle", { count: resumes.length, max: MAX_RESUMES })}
        </h2>
        <ResumeUploadForm disabled={atLimit} />
      </div>
    </div>
  );
}
