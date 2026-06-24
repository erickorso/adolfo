/**
 * Smoke tests pre-deploy (local). Requiere: Postgres + `npm run dev` en :3000.
 * Uso: npx tsx scripts/smoke-pre-deploy.ts
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  assertValidImage,
  InvalidImageError,
} from "../src/services/catalog/image.policy";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const UPLOADS = path.join(process.cwd(), ".uploads");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** PNG 1×1 válido */
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

type Result = { name: string; ok: boolean; detail: string };

const results: Result[] = [];

function record(name: string, ok: boolean, detail: string): void {
  results.push({ name, ok, detail });
  const mark = ok ? "OK" : "FAIL";
  console.log(`[${mark}] ${name} — ${detail}`);
}

async function smokeHttp(path: string, expectStatus = 200): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  record(
    `GET ${path}`,
    res.status === expectStatus,
    `status ${res.status} (expected ${expectStatus})`,
  );
}

async function smokeImageUploadAndServe(): Promise<void> {
  const product = await prisma.product.findFirst({
    where: { slug: "remera-basica" },
  });
  if (!product) {
    record("image upload", false, "producto remera-basica no encontrado (npm run db:seed)");
    return;
  }

  try {
    assertValidImage({ mimeType: "image/png", sizeBytes: TINY_PNG.byteLength });
  } catch (e) {
    record("image policy", false, String(e));
    return;
  }
  record("image policy", true, "PNG 1×1 válido");

  try {
    assertValidImage({ mimeType: "application/pdf", sizeBytes: 100 });
    record("image policy reject", false, "debió rechazar PDF");
  } catch (e) {
    record(
      "image policy reject",
      e instanceof InvalidImageError,
      e instanceof InvalidImageError ? "PDF rechazado" : String(e),
    );
  }

  const key = `catalog/product/${product.id}/${randomUUID()}.png`;
  const target = path.join(UPLOADS, key);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, TINY_PNG);

  const imageUrl = `/api/images/${key}`;
  await prisma.product.update({
    where: { id: product.id },
    data: { imageUrl },
  });
  record("image upload", true, imageUrl);

  const res = await fetch(`${BASE}${imageUrl}`);
  const ct = res.headers.get("content-type") ?? "";
  record(
    "image serve",
    res.status === 200 && ct.startsWith("image/"),
    `status ${res.status}, type ${ct}`,
  );
}

async function main(): Promise<void> {
  console.log(`Smoke pre-deploy → ${BASE}\n`);

  await smokeHttp("/es", 200);
  await smokeHttp("/api/cart", 200);
  await smokeHttp("/es/account/applications", 200);

  await smokeImageUploadAndServe();

  await prisma.$disconnect();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
