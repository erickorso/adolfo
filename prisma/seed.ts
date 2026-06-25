import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { runDevSeed } from "./seed/run";

/**
 * Seed de desarrollo. Idempotente.
 * Ejecutar con: npm run db:seed
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

main()
  .catch((error) => {
    console.error("Seed falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function main(): Promise<void> {
  console.log(await runDevSeed(prisma));
}
