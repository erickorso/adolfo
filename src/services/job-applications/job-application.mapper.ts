import type { JobApplication } from "@/generated/prisma/client";
import type { JobApplicationVM } from "@/domain/job-applications/job-application.types";

export function jobApplicationToVM(row: JobApplication): JobApplicationVM {
  return {
    id: row.id,
    jobPostingId: row.jobPostingId,
    company: row.company,
    title: row.title,
    url: row.url,
    source: row.source,
    status: row.status,
    appliedAt: row.appliedAt,
    nextStep: row.nextStep,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
