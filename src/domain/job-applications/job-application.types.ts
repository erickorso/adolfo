import type { JobApplicationStatus } from "@/generated/prisma/client";

export type { JobApplicationStatus };

export type JobApplicationVM = {
  id: string;
  jobPostingId: string | null;
  company: string;
  title: string;
  url: string | null;
  source: string | null;
  status: JobApplicationStatus;
  appliedAt: Date | null;
  nextStep: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JobApplicationStatusLogVM = {
  id: string;
  status: JobApplicationStatus;
  note: string | null;
  createdAt: Date;
};

export type JobApplicationDetailVM = JobApplicationVM & {
  statusLogs: JobApplicationStatusLogVM[];
};

export type CreateJobApplicationInput = {
  company: string;
  title: string;
  url?: string | null;
  source?: string | null;
  status?: JobApplicationStatus;
  appliedAt?: Date | null;
  nextStep?: string | null;
  notes?: string | null;
  jobPostingId?: string | null;
};

export type UpdateJobApplicationInput = {
  status?: JobApplicationStatus;
  nextStep?: string | null;
  notes?: string | null;
};

export const JOB_APPLICATION_STATUSES: JobApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREEN",
  "TECH",
  "FINAL",
  "OFFER",
  "REJECTED",
  "GHOSTED",
];

/** Orden del pipeline principal (excluye cierres negativos). */
export const PIPELINE_STATUSES: JobApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREEN",
  "TECH",
  "FINAL",
  "OFFER",
];

export type KanbanColumn = {
  id: string;
  statuses: JobApplicationStatus[];
  /** Estado al soltar una tarjeta en esta columna (si hay varios). */
  dropStatus: JobApplicationStatus;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "saved", statuses: ["SAVED"], dropStatus: "SAVED" },
  { id: "applied", statuses: ["APPLIED"], dropStatus: "APPLIED" },
  { id: "screen", statuses: ["SCREEN"], dropStatus: "SCREEN" },
  { id: "tech", statuses: ["TECH"], dropStatus: "TECH" },
  { id: "final", statuses: ["FINAL"], dropStatus: "FINAL" },
  { id: "offer", statuses: ["OFFER"], dropStatus: "OFFER" },
  {
    id: "closed",
    statuses: ["REJECTED", "GHOSTED"],
    dropStatus: "REJECTED",
  },
];

export function pipelineProgressIndex(status: JobApplicationStatus): number {
  const idx = PIPELINE_STATUSES.indexOf(status);
  return idx >= 0 ? idx : -1;
}
