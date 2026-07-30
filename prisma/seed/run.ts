import type { PrismaClient } from "../../src/generated/prisma/client";
import { catalogPlaceholderImage } from "../../src/lib/catalog-placeholders";
import { E2E_USER } from "../../src/lib/dev-seed.constants";
import {
  seedAllJobApplications,
  seedDevUsers,
} from "./dev-data";
import { seedCourses } from "./courses-data";

const products = [
  {
    slug: "producto-prueba-uala",
    name: "Producto prueba Ualá",
    description: "Solo para checkout STAGE. Precio $50 ARS (límite Ualá: $25–$100).",
    priceCents: 5000,
    stock: 999,
    imageUrl: catalogPlaceholderImage("producto-prueba-uala"),
  },
  {
    slug: "remera-basica",
    name: "Remera básica",
    description: "Algodón 100%, varios talles.",
    priceCents: 1500000,
    stock: 50,
    imageUrl: catalogPlaceholderImage("remera-basica"),
  },
  {
    slug: "buzo-canguro",
    name: "Buzo canguro",
    description: "Frisa de algodón, unisex.",
    priceCents: 3500000,
    stock: 20,
    imageUrl: catalogPlaceholderImage("buzo-canguro"),
  },
  {
    slug: "gorra-trucker",
    name: "Gorra trucker",
    description: "Ajuste regulable.",
    priceCents: 900000,
    stock: 0,
    imageUrl: catalogPlaceholderImage("gorra-trucker"),
  },
  {
    // Placeholder ARS hasta precio de lista real ($18.000 ARS).
    slug: "conjunto-deportivo-short",
    name: "Conjunto deportivo — Short",
    description: "Top deportivo + short ajustado. Calce alto rendimiento.",
    priceCents: 1800000,
    stock: 20,
    imageUrl: "/catalog/conjunto-deportivo-short.webp",
  },
  {
    // Placeholder ARS hasta precio de lista real ($18.000 ARS).
    slug: "conjunto-deportivo-culotte",
    name: "Conjunto deportivo — Culotte",
    description: "Top deportivo + culotte de tiro alto. Calce alto rendimiento.",
    priceCents: 1800000,
    stock: 20,
    imageUrl: "/catalog/conjunto-deportivo-culotte.webp",
  },
  {
    // Placeholder ARS hasta precio de lista real ($19.000 ARS).
    slug: "conjunto-deportivo-short-alto",
    name: "Conjunto deportivo — Short tiro alto",
    description: "Top deportivo + short de tiro alto. Calce alto rendimiento.",
    priceCents: 1900000,
    stock: 20,
    imageUrl: "/catalog/conjunto-deportivo-short-alto.webp",
  },
  {
    // Drop simbólico: $5 ARS (priceCents 500), NO USD.
    // Rotación semanal: cron lunes /api/jobs/ingest (Hobby máx. 2 crons)
    // o manual GET/POST /api/catalog/imagen-semana/rotate.
    // Pool: public/catalog/imagen-semana/{retrato,frente,perfil,espalda}.webp.
    slug: "imagen-semana",
    name: "Imagen de la semana — Retrato",
    description:
      "Foto exclusiva de la semana (retrato). Drop simbólico a $5 ARS.",
    priceCents: 500,
    stock: 999,
    imageUrl: "/catalog/imagen-semana/retrato.webp",
  },
];

const services = [
  {
    slug: "consultoria-1h",
    name: "Consultoría (1 hora)",
    description: "Sesión 1:1 por videollamada.",
    priceCents: 5000000,
    durationMin: 60,
    imageUrl: catalogPlaceholderImage("consultoria-1h"),
  },
  {
    slug: "setup-tienda",
    name: "Setup de tienda online",
    description: "Configuración inicial llave en mano.",
    priceCents: 12000000,
    durationMin: 240,
    imageUrl: catalogPlaceholderImage("setup-tienda"),
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
  const courseCount = await seedCourses(prisma);

  return [
    `Seed OK: ${products.length} productos, ${services.length} servicios.`,
    `Cursos: ${courseCount} en catálogo.`,
    `Usuarios dev: E2E (${E2E_USER.email} / ${E2E_USER.password}).`,
    `Postulaciones nuevas: E2E=${apps.e2e}, superadmin=${apps.superadmin}.`,
    `Dev login: GET /api/dev/login?secret=<DEV_LOGIN_SECRET>&email=e2e@test.local`,
  ].join("\n");
}
