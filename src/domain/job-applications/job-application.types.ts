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

export type UpdateJobApplicationInput = Partial<CreateJobApplicationInput>;

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
