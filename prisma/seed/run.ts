import type { PrismaClient } from "../../src/generated/prisma/client";
import { E2E_USER } from "../../src/lib/dev-seed.constants";
import {
  seedAllJobApplications,
  seedDevUsers,
} from "./dev-data";

const products = [
  {
    slug: "producto-prueba-uala",
    name: "Producto prueba Ualá",
    description: "Solo para checkout STAGE. Precio $50 ARS (límite Ualá: $25–$100).",
    priceCents: 5000,
    stock: 999,
  },
  {
    slug: "remera-basica",
    name: "Remera básica",
    description: "Algodón 100%, varios talles.",
    priceCents: 1500000,
    stock: 50,
  },
  {
    slug: "buzo-canguro",
    name: "Buzo canguro",
    description: "Frisa de algodón, unisex.",
    priceCents: 3500000,
    stock: 20,
  },
  {
    slug: "gorra-trucker",
    name: "Gorra trucker",
    description: "Ajuste regulable.",
    priceCents: 900000,
    stock: 0,
  },
];

const services = [
  {
    slug: "consultoria-1h",
    name: "Consultoría (1 hora)",
    description: "Sesión 1:1 por videollamada.",
    priceCents: 5000000,
    durationMin: 60,
  },
  {
    slug: "setup-tienda",
    name: "Setup de tienda online",
    description: "Configuración inicial llave en mano.",
    priceCents: 12000000,
    durationMin: 240,
  },
];

export async function seedCatalog(prisma: PrismaClient): Promise<void> {
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
}

export async function runDevSeed(prisma: PrismaClient): Promise<string> {
  await seedCatalog(prisma);
  await seedDevUsers(prisma);

  const superadminEmails = process.env.SUPERADMIN_EMAILS ?? "";
  const apps = await seedAllJobApplications(prisma, superadminEmails);

  return [
    `Seed OK: ${products.length} productos, ${services.length} servicios.`,
    `Usuarios dev: E2E (${E2E_USER.email} / ${E2E_USER.password}).`,
    `Postulaciones nuevas: E2E=${apps.e2e}, superadmin=${apps.superadmin}.`,
    `Dev login: GET /api/dev/login?secret=<DEV_LOGIN_SECRET>&email=e2e@test.local`,
  ].join("\n");
}
