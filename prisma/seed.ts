import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Seed de desarrollo. Idempotente: usa `upsert` por `slug` para poder correrlo
 * varias veces sin duplicar. Precios en centavos.
 *
 * Ejecutar con: npm run db:seed
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    slug: "remera-basica",
    name: "Remera básica",
    description: "Algodón 100%, varios talles.",
    priceCents: 1500000, // $15.000,00
    stock: 50,
  },
  {
    slug: "buzo-canguro",
    name: "Buzo canguro",
    description: "Frisa de algodón, unisex.",
    priceCents: 3500000, // $35.000,00
    stock: 20,
  },
  {
    slug: "gorra-trucker",
    name: "Gorra trucker",
    description: "Ajuste regulable.",
    priceCents: 900000, // $9.000,00
    stock: 0, // sin stock para probar el estado "Sin stock"
  },
];

const services = [
  {
    slug: "consultoria-1h",
    name: "Consultoría (1 hora)",
    description: "Sesión 1:1 por videollamada.",
    priceCents: 5000000, // $50.000,00
    durationMin: 60,
  },
  {
    slug: "setup-tienda",
    name: "Setup de tienda online",
    description: "Configuración inicial llave en mano.",
    priceCents: 12000000, // $120.000,00
    durationMin: 240,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      create: service,
      update: service,
    });
  }

  console.log(
    `Seed OK: ${products.length} productos, ${services.length} servicios.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
