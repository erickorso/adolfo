import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_JOB_INGEST_QUERY } from "../src/services/jobs/job-ingest.config";
import { runJobIngest } from "../src/services/jobs/job-ingest.core";
import { resolveJobSources } from "../src/services/jobs/resolve-job-sources";
import type { JobQuery } from "../src/domain/jobs/job.types";

function parseArgs(argv: string[]): JobQuery {
  const keywordsFlag = argv.findIndex((a) => a === "--keywords" || a === "-k");
  if (keywordsFlag >= 0 && argv[keywordsFlag + 1]) {
    const keywords = argv[keywordsFlag + 1]!
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    return {
      keywords,
      remoteOnly: DEFAULT_JOB_INGEST_QUERY.remoteOnly,
    };
  }
  const fromEnv = process.env.JOB_INGEST_KEYWORDS?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  if (fromEnv?.length) {
    return {
      keywords: fromEnv,
      remoteOnly: DEFAULT_JOB_INGEST_QUERY.remoteOnly,
    };
  }
  return DEFAULT_JOB_INGEST_QUERY;
}

/** Ingesta local sin Bearer (dev). Requiere DATABASE_URL.
 * Scope: `npm run jobs:ingest -- --keywords "react,python,laravel"`
 */
async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL requerida");
  }

  const query = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const sources = resolveJobSources();
    const result = await runJobIngest(prisma, sources, query);
    console.log({
      ...result,
      sources: sources.map((s) => s.name),
      query,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
