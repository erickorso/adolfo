import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { CATALOG_PLACEHOLDER_IMAGES } from "../src/lib/catalog-placeholders";

/**
 * Asigna imageUrl demo a productos/servicios del seed que aún no tienen imagen.
 * Uso: npx tsx scripts/assign-catalog-placeholder-images.ts
 */
async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const [slug, imageUrl] of Object.entries(CATALOG_PLACEHOLDER_IMAGES)) {
      const product = await prisma.product.updateMany({
        where: { slug, imageUrl: null },
        data: { imageUrl },
      });
      const service = await prisma.service.updateMany({
        where: { slug, imageUrl: null },
        data: { imageUrl },
      });

      if (product.count > 0 || service.count > 0) {
        console.log(`${slug}: productos=${product.count}, servicios=${service.count}`);
      }
    }

    console.log("Catalog placeholder images assigned.");
  } finally {
    await prisma.$disconnect();
  }
}

void main();
