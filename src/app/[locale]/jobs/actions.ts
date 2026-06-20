"use server";

import { getCurrentUser } from "@/services/users/user.service";
import {
  getResumeTextById,
  saveResumeReview,
} from "@/services/resume/resume.service";
import { getJobDetail } from "@/services/jobs/job.service";
import { improveResume } from "@/services/resume/resume-tailor";

export type ImproveResult = {
  ok: boolean;
  error?: string;
  suggestions?: string;
  rewrite?: string;
};

/**
 * Mejora un CV para una oferta concreta usando el proveedor de IA configurado.
 * Devuelve sugerencias + reescritura y persiste el resultado en ResumeReview.
 */
export async function improveResumeAction(
  _prev: ImproveResult,
  formData: FormData,
): Promise<ImproveResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Iniciá sesión para usar el asistente." };
  }

  const jobId = String(formData.get("jobId") ?? "");
  const resumeId = String(formData.get("resumeId") ?? "");
  if (!jobId || !resumeId) {
    return { ok: false, error: "Elegí un CV." };
  }

  const [resume, job] = await Promise.all([
    getResumeTextById(user.id, resumeId),
    getJobDetail(jobId),
  ]);

  if (!resume) {
    return {
      ok: false,
      error: "Ese CV no tiene texto extraíble. Subí un PDF con texto.",
    };
  }
  if (!job) {
    return { ok: false, error: "Vacante no encontrada." };
  }

  try {
    const result = await improveResume({
      resumeText: resume.text,
      jobTitle: job.title,
      jobCompany: job.company,
      jobDescription: job.description ?? "",
    });
    await saveResumeReview({
      resumeId,
      jobId,
      suggestions: result.suggestions,
      rewrite: result.rewrite,
      model: result.model,
    });
    return {
      ok: true,
      suggestions: result.suggestions,
      rewrite: result.rewrite,
    };
  } catch (error) {
    console.error("Error mejorando CV:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "No se pudo generar la mejora.",
    };
  }
}
