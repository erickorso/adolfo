"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0";
import type { User } from "@auth0/nextjs-auth0/types";

type ProvidersProps = {
  /** Usuario de la sesión server-side, para hidratar el cache del cliente sin parpadeo. */
  user?: User;
  children: React.ReactNode;
};

/**
 * Providers de cliente de la app. `Auth0Provider` habilita el hook `useUser()`
 * en componentes cliente. Se le pasa el `user` resuelto en el servidor para
 * evitar un flash de "no logueado" en el primer render.
 */
export function Providers({ user, children }: ProvidersProps) {
  return <Auth0Provider user={user}>{children}</Auth0Provider>;
}
