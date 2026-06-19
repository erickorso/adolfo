"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    // En producción esto iría a un logger (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-10">
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        No pudimos cargar el catálogo. Probá de nuevo.
      </p>
      <Button type="button" onClick={reset}>
        Reintentar
      </Button>
    </main>
  );
}
