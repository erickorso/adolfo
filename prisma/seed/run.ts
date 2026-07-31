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
    nameEn: "Ualá test product",
    description:
      "Solo para checkout STAGE. Precio $50 ARS (límite Ualá: $25–$100).",
    descriptionEn:
      "STAGE checkout only. Price $50 ARS (Ualá limit: $25–$100).",
    priceCents: 5000,
    stock: 999,
    imageUrl: catalogPlaceholderImage("producto-prueba-uala"),
  },
  {
    slug: "remera-basica",
    name: "Remera básica",
    nameEn: "Basic tee",
    description: "Algodón 100%, varios talles.",
    descriptionEn: "100% cotton, multiple sizes.",
    priceCents: 1500000,
    stock: 50,
    imageUrl: catalogPlaceholderImage("remera-basica"),
  },
  {
    slug: "buzo-canguro",
    name: "Buzo canguro",
    nameEn: "Hoodie",
    description: "Frisa de algodón, unisex.",
    descriptionEn: "Cotton fleece, unisex.",
    priceCents: 3500000,
    stock: 20,
    imageUrl: catalogPlaceholderImage("buzo-canguro"),
  },
  {
    slug: "gorra-trucker",
    name: "Gorra trucker",
    nameEn: "Trucker cap",
    description: "Ajuste regulable.",
    descriptionEn: "Adjustable fit.",
    priceCents: 900000,
    stock: 0,
    imageUrl: catalogPlaceholderImage("gorra-trucker"),
  },
  {
    // Placeholder ARS hasta precio de lista real ($18.000 ARS).
    slug: "conjunto-deportivo-short",
    name: "Conjunto deportivo — Short",
    nameEn: "Activewear set — Shorts",
    description: "Top deportivo + short ajustado. Calce alto rendimiento.",
    descriptionEn: "Sports top + fitted shorts. Performance fit.",
    priceCents: 1800000,
    stock: 20,
    imageUrl: "/catalog/conjunto-deportivo-short.webp",
  },
  {
    // Placeholder ARS hasta precio de lista real ($18.000 ARS).
    slug: "conjunto-deportivo-culotte",
    name: "Conjunto deportivo — Culotte",
    nameEn: "Activewear set — Culotte",
    description: "Top deportivo + culotte de tiro alto. Calce alto rendimiento.",
    descriptionEn: "Sports top + high-rise culotte. Performance fit.",
    priceCents: 1800000,
    stock: 20,
    imageUrl: "/catalog/conjunto-deportivo-culotte.webp",
  },
  {
    // Placeholder ARS hasta precio de lista real ($19.000 ARS).
    slug: "conjunto-deportivo-short-alto",
    name: "Conjunto deportivo — Short tiro alto",
    nameEn: "Activewear set — High-rise shorts",
    description: "Top deportivo + short de tiro alto. Calce alto rendimiento.",
    descriptionEn: "Sports top + high-rise shorts. Performance fit.",
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
    nameEn: "Image of the week — Portrait",
    description:
      "Foto exclusiva de la semana (retrato). Drop simbólico a $5 ARS.",
    descriptionEn:
      "Exclusive photo of the week (portrait). Symbolic drop at $5 ARS.",
    priceCents: 500,
    stock: 999,
    imageUrl: "/catalog/imagen-semana/retrato.webp",
  },
];

const services = [
  {
    slug: "consultoria-1h",
    name: "Consultoría (1 hora)",
    nameEn: "Consulting (1 hour)",
    description: "Sesión 1:1 por videollamada.",
    descriptionEn: "1:1 video call session.",
    priceCents: 5000000,
    durationMin: 60,
    imageUrl: catalogPlaceholderImage("consultoria-1h"),
  },
  {
    slug: "setup-tienda",
    name: "Setup de tienda online",
    nameEn: "Online store setup",
    description: "Configuración inicial llave en mano.",
    descriptionEn: "Turnkey initial setup.",
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
