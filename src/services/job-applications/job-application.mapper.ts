import type {
  JobApplication,
  JobApplicationStatusLog,
} from "@/generated/prisma/client";
import type {
  JobApplicationDetailVM,
  JobApplicationStatusLogVM,
  JobApplicationVM,
} from "@/domain/job-applications/job-application.types";

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

export function statusLogToVM(row: JobApplicationStatusLog): JobApplicationStatusLogVM {
  return {
    id: row.id,
    status: row.status,
    note: row.note,
    createdAt: row.createdAt,
  };
}

export function jobApplicationDetailToVM(
  row: JobApplication & { statusLogs: JobApplicationStatusLog[] },
): JobApplicationDetailVM {
  return {
    ...jobApplicationToVM(row),
    statusLogs: row.statusLogs.map(statusLogToVM),
  };
}
