import { env } from "@/lib/env";
import type { JobSource } from "@/domain/jobs/job.types";
import { GreenhouseSource } from "./sources/greenhouse.source";
import { RemotiveSource } from "./sources/remotive.source";

/** Arma las fuentes activas según env (Remotive siempre; Greenhouse si hay boards). */
export function resolveJobSources(): JobSource[] {
  const sources: JobSource[] = [new RemotiveSource()];

  const boards = env.JOBS_GREENHOUSE_BOARDS.split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (boards.length > 0) {
    sources.push(new GreenhouseSource(boards));
  }

  return sources;
}
