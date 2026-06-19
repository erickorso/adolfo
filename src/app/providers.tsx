"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Providers de cliente. SessionProvider habilita useSession() en componentes
 * cliente (Auth.js v5). La sesión se obtiene de /api/auth/session.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
