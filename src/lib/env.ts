import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Variables de entorno tipadas y validadas en build-time.
 * Si falta una variable o tiene formato inválido, el build falla acá
 * en vez de explotar en runtime con un `undefined` silencioso.
 *
 * Regla: NUNCA leer `process.env` directamente en el código de la app.
 * Importar siempre desde `@/lib/env`.
 */
export const env = createEnv({
  /** Solo servidor: jamás se exponen al cliente. */
  server: {
    DATABASE_URL: z.url(),

    // Auth.js (NextAuth v5)
    /** Secreto para firmar JWT/cookies. Generar con: openssl rand -base64 32 */
    AUTH_SECRET: z.string().min(1),
    /** URL pública (Auth.js la infiere en dev; setear en prod). */
    AUTH_URL: z.url().optional(),
    /** OAuth de Google — opcional, para sumar login con Google más adelante. */
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    // Ualá Bis API Cobros Online v2 (opcionales en build; requeridas en runtime)
    /** @deprecated Usar UALA_CHECKOUT_URL. Mantenido por compatibilidad. */
    UALA_API_BASE_URL: z.url().optional(),
    /** Base auth prod: https://auth.developers.ar.ua.la/v2/api — stage: auth.stage.developers.ar.ua.la */
    UALA_AUTH_URL: z.url().optional(),
    /** Base checkout prod: https://checkout.developers.ar.ua.la/v2/api — stage: checkout.stage.developers.ar.ua.la */
    UALA_CHECKOUT_URL: z.url().optional(),
    /** Usuario de la cuenta Ualá (requerido para token). */
    UALA_USERNAME: z.string().optional(),
    UALA_CLIENT_ID: z.string().optional(),
    /** Secret oficial v2 (`client_secret_id` en la doc). */
    UALA_CLIENT_SECRET_ID: z.string().optional(),
    /** @deprecated Alias de UALA_CLIENT_SECRET_ID. */
    UALA_CLIENT_SECRET: z.string().optional(),

    // Módulo de empleos
    /** Boards de Greenhouse a ingestar, separados por coma (ej. "stripe,vercel"). */
    JOBS_GREENHOUSE_BOARDS: z.string().default(""),
    /** Bearer secret para autorizar el endpoint de ingesta (cron). Opcional. */
    JOBS_INGEST_SECRET: z.string().optional(),
    /** Vercel Cron envía Authorization: Bearer <CRON_SECRET>. Puede ser igual a JOBS_INGEST_SECRET. */
    CRON_SECRET: z.string().optional(),

    // IA (asistente de CV) — proveedor swappable
    AI_PROVIDER: z.enum(["gemini"]).default("gemini"),
    /** API key de Google AI Studio (Gemini). Opcional hasta usar el feature. */
    GEMINI_API_KEY: z.string().optional(),
    GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

    // Conversión de moneda (display). "tarjeta" = lo más fiel a lo que descuentan.
    EXCHANGE_RATE_TYPE: z
      .enum(["tarjeta", "oficial", "blue", "mep"])
      .default("tarjeta"),

    /** Emails que se promueven a SUPERADMIN al loguearse (bootstrap), separados por coma. */
    SUPERADMIN_EMAILS: z.string().default(""),

    // Email transaccional
    EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
    /** Remitente (ej. "Catálogo <pedidos@tudominio.com>"). Requerido con resend. */
    EMAIL_FROM: z.string().default("Catálogo <onboarding@resend.dev>"),
    RESEND_API_KEY: z.string().optional(),

    // Storage de objetos (CVs, imágenes)
    /** "local" dev · "blob" Vercel Blob · "s3" AWS/R2 */
    STORAGE_DRIVER: z.enum(["local", "blob", "s3"]).default("local"),
    /** Auto-inyectado al conectar Blob store en Vercel. */
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    /** Endpoint S3-compatible (Cloudflare R2, MinIO). */
    S3_ENDPOINT: z.url().optional(),
  },

  /** Expuestas al browser. Deben empezar con NEXT_PUBLIC_. */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Catálogo"),
  },

  /**
   * Next.js no inyecta las server vars en el bundle, así que hay que
   * mapearlas manualmente acá.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    UALA_API_BASE_URL: process.env.UALA_API_BASE_URL,
    UALA_AUTH_URL: process.env.UALA_AUTH_URL,
    UALA_CHECKOUT_URL: process.env.UALA_CHECKOUT_URL,
    UALA_USERNAME: process.env.UALA_USERNAME,
    UALA_CLIENT_ID: process.env.UALA_CLIENT_ID,
    UALA_CLIENT_SECRET_ID: process.env.UALA_CLIENT_SECRET_ID,
    UALA_CLIENT_SECRET: process.env.UALA_CLIENT_SECRET,
    JOBS_GREENHOUSE_BOARDS: process.env.JOBS_GREENHOUSE_BOARDS,
    JOBS_INGEST_SECRET: process.env.JOBS_INGEST_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
    AI_PROVIDER: process.env.AI_PROVIDER,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    EXCHANGE_RATE_TYPE: process.env.EXCHANGE_RATE_TYPE,
    SUPERADMIN_EMAILS: process.env.SUPERADMIN_EMAILS,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STORAGE_DRIVER: process.env.STORAGE_DRIVER,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /** Trata "" como undefined para que los `.default()` apliquen. */
  emptyStringAsUndefined: true,

  /** Permite `next build` / lint sin envs reales (CI, scaffolding). */
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.NODE_ENV === "test",
});
