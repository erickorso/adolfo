import type { JobQuery } from "@/domain/jobs/job.types";
import { JS_NODE_JOB_QUERY_KEYWORDS } from "@/domain/jobs/job-filters";

/** Filtro por defecto al ingestar (React/TS/Node, remoto, últimos 10 días). */
export const DEFAULT_JOB_INGEST_QUERY: JobQuery = {
  keywords: [...JS_NODE_JOB_QUERY_KEYWORDS],
  remoteOnly: true,
};

/** Títulos/roles a excluir en agregadores (ruido fuera de perfil). */
export const REMOTIVE_TITLE_EXCLUDE =
  /sales|office assistant|data label|quality assurance rater|copywriter|video editor|pharmacist|medical|writer|payable|data analyst|data scientist|rails|ruby|ios developer|android|wordpress|salesforce|qa rater/i;

/** Boards Greenhouse por defecto si `JOBS_GREENHOUSE_BOARDS` está vacío. */
export const DEFAULT_GREENHOUSE_BOARDS = [
  "gitlab",
  "figma",
  "vercel",
  "discord",
  "stripe",
] as const;
