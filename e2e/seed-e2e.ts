import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { E2E_USER } from "./constants";

/** Siembra usuario y catálogo mínimo para E2E (idempotente). */
async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL requerida para seed E2E");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const passwordHash = await bcrypt.hash(E2E_USER.password, 10);

  try {
    await prisma.user.upsert({
      where: { email: E2E_USER.email },
      create: {
        email: E2E_USER.email,
        name: E2E_USER.name,
        passwordHash,
      },
      update: { name: E2E_USER.name, passwordHash },
    });

    await prisma.product.upsert({
      where: { slug: "remera-basica" },
      create: {
        slug: "remera-basica",
        name: "Remera básica",
        description: "Algodón 100%, varios talles.",
        priceCents: 1500000,
        stock: 50,
      },
      update: { stock: 50, active: true },
    });

    console.log("E2E seed OK");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("E2E seed falló:", error);
  process.exit(1);
});
