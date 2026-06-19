"use server";

import { revalidatePath } from "next/cache";
import { syncUserFromSession } from "@/services/users/user.service";
import {
  createResume,
  deleteResume,
  setDefaultResume,
} from "@/services/resume/resume.service";
import {
  InvalidResumeFileError,
  ResumeLimitError,
} from "@/services/resume/resume.policy";

/** Resultado uniforme para los formularios (useFormState-friendly). */
export type ActionResult = { ok: boolean; error?: string };

const CVS_PATH = "/account/cvs";

/** Sube un CV nuevo desde el formulario. */
export async function uploadResumeAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await syncUserFromSession();
  if (!user) {
    return { ok: false, error: "Tenés que iniciar sesión." };
  }

  const file = formData.get("file");
  const label = String(formData.get("label") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Seleccioná un archivo." };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    await createResume(user.id, {
      label,
      file: { originalName: file.name, mimeType: file.type, bytes },
    });
    revalidatePath(CVS_PATH);
    return { ok: true };
  } catch (error) {
    if (
      error instanceof ResumeLimitError ||
      error instanceof InvalidResumeFileError
    ) {
      return { ok: false, error: error.message };
    }
    console.error("Error subiendo CV:", error);
    return { ok: false, error: "No se pudo subir el CV." };
  }
}

/** Marca un CV como default. */
export async function setDefaultResumeAction(formData: FormData): Promise<void> {
  const user = await syncUserFromSession();
  if (!user) return;
  const resumeId = String(formData.get("resumeId") ?? "");
  if (!resumeId) return;
  await setDefaultResume(user.id, resumeId);
  revalidatePath(CVS_PATH);
}

/** Elimina un CV. */
export async function deleteResumeAction(formData: FormData): Promise<void> {
  const user = await syncUserFromSession();
  if (!user) return;
  const resumeId = String(formData.get("resumeId") ?? "");
  if (!resumeId) return;
  await deleteResume(user.id, resumeId);
  revalidatePath(CVS_PATH);
}
