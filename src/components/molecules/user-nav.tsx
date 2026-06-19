"use client";

import { useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { AuthLink } from "@/components/atoms/auth-link";
import { Button } from "@/components/ui/button";

/**
 * Molécula: área de usuario del header.
 * Usa useSession() de Auth.js (client) para reaccionar a login/logout.
 */
export function UserNav() {
  const { data: session, status } = useSession();

  const handleSignOut = useCallback(() => {
    void signOut({ callbackUrl: "/" });
  }, []);

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (!session?.user) {
    return (
      <AuthLink href="/login" size="sm">
        Ingresar
      </AuthLink>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-foreground sm:inline">
        {session.user.name ?? session.user.email}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
        Salir
      </Button>
    </div>
  );
}
