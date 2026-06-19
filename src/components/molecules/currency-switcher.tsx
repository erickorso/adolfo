"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/use-currency";
import { useRate } from "@/hooks/use-rate";

/**
 * Molécula: alterna la moneda de visualización ARS / USD.
 * El tooltip muestra qué cotización se usa (ej. dólar tarjeta).
 */
export function CurrencySwitcher() {
  const { currency, toggle, hydrated } = useCurrency();
  const rate = useRate();

  const handleToggle = useCallback(() => {
    toggle();
  }, [toggle]);

  // Sin cotización disponible no ofrecemos el cambio a USD.
  if (!rate) {
    return null;
  }

  const hint = `1 USD ≈ $${Math.round(rate.sellArs)} (dólar ${rate.type})`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      title={hint}
      aria-label={`Moneda: ${hydrated ? currency : "ARS"}. Cambiar.`}
    >
      {hydrated ? currency : "ARS"}
    </Button>
  );
}
