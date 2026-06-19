import "server-only";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import type { IncomingFile, ResumeVM } from "@/domain/resume/resume.types";
import { assertCanAddResume, assertValidResumeFile, isPdf } from "./resume.policy";
import { extractResumeText } from "./extract-text";
import { resumeToVM } from "./resume.mapper";

/** Lista los CVs de un usuario (el default primero). */
export async function listResumes(userId: string): Promise<ResumeVM[]> {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return resumes.map(resumeToVM);
}

/** Sube un CV nuevo (valida tipo/tamaño y el límite de 3). */
export async function createResume(
  userId: string,
  input: { label: string; file: IncomingFile },
): Promise<ResumeVM> {
  const sizeBytes = input.file.bytes.byteLength;
  assertValidResumeFile({ mimeType: input.file.mimeType, sizeBytes });

  const count = await prisma.resume.count({ where: { userId } });
  assertCanAddResume(count);

  const ext = isPdf(input.file.mimeType) ? "pdf" : "docx";
  const storageKey = `resumes/${userId}/${randomUUID()}.${ext}`;
  const extractedText = await extractResumeText(
    input.file.bytes,
    input.file.mimeType,
  );

  await storage.put(storageKey, input.file.bytes, input.file.mimeType);

  const resume = await prisma.resume.create({
    data: {
      userId,
      label: input.label.trim() || input.file.originalName,
      storageKey,
      mimeType: input.file.mimeType,
      sizeBytes,
      extractedText,
      // El primer CV queda como default automáticamente.
      isDefault: count === 0,
    },
  });

  return resumeToVM(resume);
}

/** Marca un CV como default (desmarca el resto), validando ownership. */
export async function setDefaultResume(
  userId: string,
  resumeId: string,
): Promise<void> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!resume) {
    throw new Error("CV no encontrado");
  }
  await prisma.$transaction([
    prisma.resume.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.resume.update({ where: { id: resumeId }, data: { isDefault: true } }),
  ]);
}

/** Elimina un CV (storage + DB), validando ownership. */
export async function deleteResume(
  userId: string,
  resumeId: string,
): Promise<void> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!resume) {
    return;
  }
  await storage.delete(resume.storageKey);
  await prisma.resume.delete({ where: { id: resumeId } });
}

/** Texto extraído de un CV (si pertenece al usuario), para el asistente de IA. */
export async function getResumeTextById(
  userId: string,
  resumeId: string,
): Promise<{ label: string; text: string } | null> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!resume?.extractedText) {
    return null;
  }
  return { label: resume.label, text: resume.extractedText };
}

/** Guarda el resultado de una mejora asistida por IA. */
export async function saveResumeReview(input: {
  resumeId: string;
  jobId: string | null;
  suggestions: string;
  rewrite: string;
  model: string;
}): Promise<void> {
  await prisma.resumeReview.create({ data: input });
}

/** Devuelve los bytes de un CV por id si pertenece al usuario (para servirlo). */
export async function getOwnedResumeFileById(
  userId: string,
  resumeId: string,
): Promise<{ bytes: Buffer; mimeType: string } | null> {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!resume) {
    return null;
  }
  const bytes = await storage.getBytes(resume.storageKey);
  return { bytes, mimeType: resume.mimeType };
}
