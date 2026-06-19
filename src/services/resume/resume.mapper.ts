import type { Resume } from "@/generated/prisma/client";
import type { ResumeVM } from "@/domain/resume/resume.types";

/** Resume de la DB -> view model (oculta storageKey y el texto crudo). */
export function resumeToVM(resume: Resume): ResumeVM {
  return {
    id: resume.id,
    label: resume.label,
    mimeType: resume.mimeType,
    sizeBytes: resume.sizeBytes,
    isDefault: resume.isDefault,
    hasText: Boolean(resume.extractedText && resume.extractedText.length > 0),
    createdAt: resume.createdAt,
  };
}
