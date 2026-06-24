import "server-only";
import type { JobApplicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateJobApplicationInput,
  JobApplicationVM,
} from "@/domain/job-applications/job-application.types";
import { jobApplicationToVM } from "./job-application.mapper";

const ACTIVE_STATUSES: JobApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREEN",
  "TECH",
  "FINAL",
  "OFFER",
];

function resolveAppliedAt(
  status: JobApplicationStatus,
  appliedAt?: Date | null,
): Date | null {
  if (appliedAt) return appliedAt;
  if (status === "SAVED") return null;
  return new Date();
}

/** Lista postulaciones del usuario (activas primero, luego por fecha). */
export async function listUserJobApplications(
  userId: string,
): Promise<JobApplicationVM[]> {
  const rows = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
  });

  return rows
    .map(jobApplicationToVM)
    .sort((a, b) => {
      const aActive = ACTIVE_STATUSES.includes(a.status) ? 0 : 1;
      const bActive = ACTIVE_STATUSES.includes(b.status) ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
}

/** Crea una postulación manual o vinculada a JobPosting. */
export async function createJobApplication(
  userId: string,
  input: CreateJobApplicationInput,
): Promise<JobApplicationVM> {
  const status = input.status ?? "SAVED";

  const row = await prisma.jobApplication.create({
    data: {
      userId,
      jobPostingId: input.jobPostingId ?? null,
      company: input.company.trim(),
      title: input.title.trim(),
      url: input.url?.trim() || null,
      source: input.source?.trim() || null,
      status,
      appliedAt: resolveAppliedAt(status, input.appliedAt),
      nextStep: input.nextStep?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });

  return jobApplicationToVM(row);
}

/** Crea postulación a partir de una vacante ingestada. */
export async function createJobApplicationFromPosting(
  userId: string,
  jobPostingId: string,
  overrides?: Pick<
    CreateJobApplicationInput,
    "status" | "source" | "appliedAt" | "nextStep" | "notes"
  >,
): Promise<JobApplicationVM> {
  const job = await prisma.jobPosting.findUnique({ where: { id: jobPostingId } });
  if (!job) {
    throw new Error("Vacante no encontrada");
  }

  return createJobApplication(userId, {
    jobPostingId,
    company: job.company,
    title: job.title,
    url: job.url,
    source: overrides?.source ?? job.source,
    status: overrides?.status ?? "SAVED",
    appliedAt: overrides?.appliedAt,
    nextStep: overrides?.nextStep,
    notes: overrides?.notes,
  });
}

/** Actualiza estado (y appliedAt si pasa de saved → applied). */
export async function updateJobApplicationStatus(
  userId: string,
  applicationId: string,
  status: JobApplicationStatus,
): Promise<void> {
  const existing = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
  if (!existing) {
    throw new Error("Postulación no encontrada");
  }

  await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status,
      appliedAt:
        existing.appliedAt ??
        (status !== "SAVED" ? new Date() : null),
    },
  });
}

/** Elimina una postulación del usuario. */
export async function deleteJobApplication(
  userId: string,
  applicationId: string,
): Promise<void> {
  const existing = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
  if (!existing) {
    throw new Error("Postulación no encontrada");
  }
  await prisma.jobApplication.delete({ where: { id: applicationId } });
}

/** Métricas simples para el encabezado de la página. */
export async function getJobApplicationStats(userId: string): Promise<{
  total: number;
  applied: number;
  active: number;
}> {
  const rows = await prisma.jobApplication.findMany({
    where: { userId },
    select: { status: true },
  });

  return {
    total: rows.length,
    applied: rows.filter((r) => r.status !== "SAVED").length,
    active: rows.filter((r) => ACTIVE_STATUSES.includes(r.status)).length,
  };
}
