"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { AuthLink } from "@/components/atoms/auth-link";

/**
 * Molécula: área de usuario del header.
 * Usa el hook `useUser()` (client) para reaccionar a login/logout sin recargar.
 *
 * El user NO se guarda en ningún store: Auth0 es la fuente de verdad (estado
 * de servidor expuesto vía SWR por el SDK).
 */
export function UserNav() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-neutral-200" />;
  }

  if (!user) {
    return (
      <AuthLink href="/auth/login" size="sm">
        Ingresar
      </AuthLink>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-neutral-700 sm:inline">
        {user.name ?? user.email}
      </span>
      <AuthLink href="/auth/logout" variant="outline" size="sm">
        Salir
      </AuthLink>
    </div>
  );
}
