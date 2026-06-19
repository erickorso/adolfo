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
export function ResumeManager({ resumes }: ResumeManagerProps) {
  const atLimit = resumes.length >= MAX_RESUMES;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {resumes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no subiste ningún CV.
          </p>
        ) : (
          resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
        )}
      </div>

      <div className="rounded-lg border border-dashed border-input p-4">
        <h2 className="mb-3 text-sm font-semibold">
          Subir CV ({resumes.length}/{MAX_RESUMES})
        </h2>
        <ResumeUploadForm disabled={atLimit} />
      </div>
    </div>
  );
}
