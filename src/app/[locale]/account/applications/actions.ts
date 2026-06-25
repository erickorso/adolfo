"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/users/user.service";
import {
  createJobApplication,
  createJobApplicationFromPosting,
  deleteJobApplication,
  updateJobApplication,
  updateJobApplicationStatus,
} from "@/services/job-applications/job-application.service";
import {
  createJobApplicationSchema,
  deleteJobApplicationSchema,
  updateJobApplicationSchema,
  updateJobApplicationStatusSchema,
} from "@/domain/schemas/job-application";

export type ActionResult = { ok: boolean; error?: string };

const APPLICATIONS_PATH = "/account/applications";

function revalidateApplications(applicationId?: string): void {
  revalidatePath(APPLICATIONS_PATH);
  if (applicationId) {
    revalidatePath(`${APPLICATIONS_PATH}/${applicationId}`);
  }
}

export async function createJobApplicationAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Tenés que iniciar sesión." };
  }

  const parsed = createJobApplicationSchema.safeParse({
    company: formData.get("company"),
    title: formData.get("title"),
    url: formData.get("url"),
    source: formData.get("source"),
    status: formData.get("status") ?? "SAVED",
    appliedAt: formData.get("appliedAt"),
    nextStep: formData.get("nextStep"),
    notes: formData.get("notes"),
    jobPostingId: formData.get("jobPostingId"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await createJobApplication(user.id, parsed.data);
    revalidateApplications();
    return { ok: true };
  } catch (error) {
    console.error("Error creando postulación:", error);
    return { ok: false, error: "No se pudo guardar la postulación." };
  }
}

export async function trackJobPostingAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const jobPostingId = String(formData.get("jobPostingId") ?? "");
  const status = String(formData.get("status") ?? "SAVED");
  if (!jobPostingId) return;

  try {
    await createJobApplicationFromPosting(user.id, jobPostingId, {
      status: status as "SAVED" | "APPLIED",
      source: String(formData.get("source") ?? "") || undefined,
    });
    revalidateApplications();
    revalidatePath(`/jobs/${jobPostingId}`);
  } catch (error) {
    console.error("Error vinculando vacante:", error);
  }
}

export async function updateJobApplicationStatusAction(
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const parsed = updateJobApplicationStatusSchema.safeParse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  try {
    await updateJobApplicationStatus(
      user.id,
      parsed.data.applicationId,
      parsed.data.status,
    );
    revalidateApplications(parsed.data.applicationId);
  } catch (error) {
    console.error("Error actualizando estado:", error);
  }
}

export async function updateJobApplicationAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Tenés que iniciar sesión." };
  }

  const parsed = updateJobApplicationSchema.safeParse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status") || undefined,
    nextStep: formData.get("nextStep"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await updateJobApplication(user.id, parsed.data.applicationId, {
      status: parsed.data.status,
      nextStep: parsed.data.nextStep,
      notes: parsed.data.notes,
    });
    revalidateApplications(parsed.data.applicationId);
    return { ok: true };
  } catch (error) {
    console.error("Error actualizando postulación:", error);
    return { ok: false, error: "No se pudo actualizar." };
  }
}

export async function deleteJobApplicationAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const parsed = deleteJobApplicationSchema.safeParse({
    applicationId: formData.get("applicationId"),
  });
  if (!parsed.success) return;

  try {
    await deleteJobApplication(user.id, parsed.data.applicationId);
    revalidateApplications();
    redirect(APPLICATIONS_PATH);
  } catch (error) {
    console.error("Error eliminando postulación:", error);
  }
}
