import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { runDevSeed } from "../prisma/seed/run";

/** Siembra catálogo, usuario E2E y postulaciones demo (idempotente). */
async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL requerida para seed E2E");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(await runDevSeed(prisma));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("E2E seed falló:", error);
  process.exit(1);
});
