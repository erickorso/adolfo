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

    // Ualá Bis (opcionales: el checkout aún no está conectado)
    UALA_API_BASE_URL: z.url().optional(),
    UALA_CLIENT_ID: z.string().optional(),
    UALA_CLIENT_SECRET: z.string().optional(),
    /** Secreto compartido para verificar la firma del webhook. */
    UALA_WEBHOOK_SECRET: z.string().optional(),

    // Módulo de empleos
    /** Boards de Greenhouse a ingestar, separados por coma (ej. "stripe,vercel"). */
    JOBS_GREENHOUSE_BOARDS: z.string().default(""),
    /** Bearer secret para autorizar el endpoint de ingesta (cron). Opcional. */
    JOBS_INGEST_SECRET: z.string().optional(),

    // IA (asistente de CV) — proveedor swappable
    AI_PROVIDER: z.enum(["gemini"]).default("gemini"),
    /** API key de Google AI Studio (Gemini). Opcional hasta usar el feature. */
    GEMINI_API_KEY: z.string().optional(),
    GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
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
    UALA_CLIENT_ID: process.env.UALA_CLIENT_ID,
    UALA_CLIENT_SECRET: process.env.UALA_CLIENT_SECRET,
    UALA_WEBHOOK_SECRET: process.env.UALA_WEBHOOK_SECRET,
    JOBS_GREENHOUSE_BOARDS: process.env.JOBS_GREENHOUSE_BOARDS,
    JOBS_INGEST_SECRET: process.env.JOBS_INGEST_SECRET,
    AI_PROVIDER: process.env.AI_PROVIDER,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /** Trata "" como undefined para que los `.default()` apliquen. */
  emptyStringAsUndefined: true,

  /** Permite `next build` / lint sin envs reales (CI, scaffolding). */
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.NODE_ENV === "test",
});
