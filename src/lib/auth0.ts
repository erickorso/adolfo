import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Cliente de Auth0 (SDK v4).
 * Lee la configuración desde el entorno: AUTH0_DOMAIN, AUTH0_CLIENT_ID,
 * AUTH0_CLIENT_SECRET, AUTH0_SECRET y APP_BASE_URL.
 *
 * El SDK v4 monta automáticamente las rutas /auth/login, /auth/logout
 * y /auth/callback a través del middleware (ver src/middleware.ts).
 */
export const auth0 = new Auth0Client();
