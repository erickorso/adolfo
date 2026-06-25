import "server-only";
import type { JobApplicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateJobApplicationInput,
  JobApplicationDetailVM,
  JobApplicationVM,
  UpdateJobApplicationInput,
} from "@/domain/job-applications/job-application.types";
import {
  jobApplicationDetailToVM,
  jobApplicationToVM,
} from "./job-application.mapper";

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

/** Detalle con historial de progreso. */
export async function getJobApplicationDetail(
  userId: string,
  applicationId: string,
): Promise<JobApplicationDetailVM | null> {
  const row = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
    include: {
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!row) return null;
  return jobApplicationDetailToVM(row);
}

/** Crea una postulación manual o vinculada a JobPosting. */
export async function createJobApplication(
  userId: string,
  input: CreateJobApplicationInput,
): Promise<JobApplicationVM> {
  const status = input.status ?? "SAVED";

  const row = await prisma.$transaction(async (tx) => {
    const created = await tx.jobApplication.create({
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
    await tx.jobApplicationStatusLog.create({
      data: {
        applicationId: created.id,
        status,
        note: "Postulación creada",
      },
    });
    return created;
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

/** Actualiza estado y registra progreso. */
export async function updateJobApplicationStatus(
  userId: string,
  applicationId: string,
  status: JobApplicationStatus,
  note?: string | null,
): Promise<void> {
  const existing = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
  if (!existing) {
    throw new Error("Postulación no encontrada");
  }

  await prisma.$transaction(async (tx) => {
    await tx.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        appliedAt:
          existing.appliedAt ??
          (status !== "SAVED" ? new Date() : null),
      },
    });
    if (existing.status !== status) {
      await tx.jobApplicationStatusLog.create({
        data: {
          applicationId,
          status,
          note: note?.trim() || `Movido a ${status}`,
        },
      });
    }
  });
}

/** Actualiza notas / próximo paso / estado desde el detalle. */
export async function updateJobApplication(
  userId: string,
  applicationId: string,
  input: UpdateJobApplicationInput,
): Promise<void> {
  const existing = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });
  if (!existing) {
    throw new Error("Postulación no encontrada");
  }

  const nextStatus = input.status ?? existing.status;

  await prisma.$transaction(async (tx) => {
    await tx.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        nextStep:
          input.nextStep !== undefined
            ? input.nextStep?.trim() || null
            : existing.nextStep,
        notes:
          input.notes !== undefined
            ? input.notes?.trim() || null
            : existing.notes,
        appliedAt:
          existing.appliedAt ??
          (nextStatus !== "SAVED" ? new Date() : null),
      },
    });
    if (input.status && input.status !== existing.status) {
      await tx.jobApplicationStatusLog.create({
        data: {
          applicationId,
          status: input.status,
          note: `Actualizado a ${input.status}`,
        },
      });
    }
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
