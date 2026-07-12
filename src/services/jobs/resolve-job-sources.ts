import { env } from "@/lib/env";
import type { JobSource } from "@/domain/jobs/job.types";
import { DEFAULT_GREENHOUSE_BOARDS } from "./job-ingest.config";
import { ArbeitnowSource } from "./sources/arbeitnow.source";
import { GreenhouseSource } from "./sources/greenhouse.source";
import { HackerNewsJobsSource } from "./sources/hackernews.source";
import { RemotiveSource } from "./sources/remotive.source";
import { RemoteOkSource } from "./sources/remoteok.source";

/** Arma las fuentes activas según env (portales con API pública). */
export function resolveJobSources(): JobSource[] {
  const sources: JobSource[] = [
    new RemotiveSource(),
    new RemoteOkSource(),
    new ArbeitnowSource(),
    new HackerNewsJobsSource(),
  ];

  const fromEnv = env.JOBS_GREENHOUSE_BOARDS.split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  const boards = fromEnv.length > 0 ? fromEnv : [...DEFAULT_GREENHOUSE_BOARDS];

  sources.push(new GreenhouseSource(boards));

  return sources;
}
