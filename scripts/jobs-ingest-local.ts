import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_JOB_INGEST_QUERY } from "../src/services/jobs/job-ingest.config";
import { runJobIngest } from "../src/services/jobs/job-ingest.core";
import { resolveJobSources } from "../src/services/jobs/resolve-job-sources";

/** Ingesta local sin Bearer (dev). Requiere DATABASE_URL. */
async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL requerida");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const sources = resolveJobSources();
    const result = await runJobIngest(prisma, sources, DEFAULT_JOB_INGEST_QUERY);
    console.log({
      ...result,
      sources: sources.map((s) => s.name),
      query: DEFAULT_JOB_INGEST_QUERY,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
