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

    // Auth0 (@auth0/nextjs-auth0 v4)
    AUTH0_SECRET: z.string().min(32),
    AUTH0_DOMAIN: z.string().min(1),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    APP_BASE_URL: z.url(),

    // Ualá Bis
    UALA_API_BASE_URL: z.url(),
    UALA_CLIENT_ID: z.string().min(1),
    UALA_CLIENT_SECRET: z.string().min(1),
    /** Secreto compartido para verificar la firma del webhook. */
    UALA_WEBHOOK_SECRET: z.string().min(1),
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
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    APP_BASE_URL: process.env.APP_BASE_URL,
    UALA_API_BASE_URL: process.env.UALA_API_BASE_URL,
    UALA_CLIENT_ID: process.env.UALA_CLIENT_ID,
    UALA_CLIENT_SECRET: process.env.UALA_CLIENT_SECRET,
    UALA_WEBHOOK_SECRET: process.env.UALA_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /** Trata "" como undefined para que los `.default()` apliquen. */
  emptyStringAsUndefined: true,

  /** Permite `next build` / lint sin envs reales (CI, scaffolding). */
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.NODE_ENV === "test",
});
