import type { JobQuery } from "@/domain/jobs/job.types";

/** Filtro por defecto al ingestar (Senior React/TS, remoto). */
export const DEFAULT_JOB_INGEST_QUERY: JobQuery = {
  keywords: [
    "react",
    "next.js",
    "nextjs",
    "frontend",
    "front-end",
    "typescript",
    "javascript",
    "full stack",
    "fullstack",
    "tech lead",
    "software engineer",
    "software developer",
    "engineering lead",
    "staff",
    "architect",
  ],
  remoteOnly: true,
};

/** Títulos/roles a excluir en Remotive (ruido fuera de perfil). */
export const REMOTIVE_TITLE_EXCLUDE =
  /sales|office assistant|data label|quality assurance rater|copywriter|video editor|pharmacist|medical|writer|payable|data analyst|data scientist|rails|ruby|ios developer|android|wordpress|salesforce|qa rater/i;
