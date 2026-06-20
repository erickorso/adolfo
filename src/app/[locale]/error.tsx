"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type CatalogErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Error boundary de la home. Los Error Components en App Router deben ser
 * client components y reciben `reset` para reintentar el render del segmento.
 */
export default function CatalogError({ error, reset }: CatalogErrorProps) {
  const t = useTranslations("error");

  useEffect(() => {
    // En producción esto iría a un logger (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-10">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("message")}</p>
      <Button type="button" onClick={reset}>
        {t("retry")}
      </Button>
    </main>
  );
}
