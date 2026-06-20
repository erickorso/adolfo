"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/** Alterna el idioma (ES/EN) manteniendo la misma ruta. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const target = locale === "es" ? "en" : "es";

  const handleSwitch = useCallback(() => {
    router.replace(pathname, { locale: target });
  }, [router, pathname, target]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      aria-label="Cambiar idioma / Switch language"
    >
      {target.toUpperCase()}
    </Button>
  );
}
