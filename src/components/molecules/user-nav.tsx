"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

/**
 * Molécula: área de usuario del header.
 * Usa useSession() de Auth.js (client) para reaccionar a login/logout.
 */
export function UserNav() {
  const t = useTranslations("nav");
  const { data: session, status } = useSession();

  const handleSignOut = useCallback(() => {
    void signOut({ callbackUrl: "/" });
  }, []);

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
        {t("login")}
      </Link>
    );
  }

  const role = session.user.role;
  const isStaff = role === "ADMIN" || role === "SUPERADMIN";

  return (
    <div className="flex items-center gap-3">
      {isStaff ? (
        <Link
          href="/admin"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("admin")}
        </Link>
      ) : null}
      <span className="hidden text-sm text-foreground sm:inline">
        {session.user.name ?? session.user.email}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
        {t("logout")}
      </Button>
    </div>
  );
}
