"use client";

import { arsCentsToUsd, formatMoney, formatUsd } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";
import { useRate } from "@/hooks/use-rate";

type PriceProps = {
  /** Monto en centavos (de `currency`). */
  cents: number;
  currency?: string;
  className?: string;
};

/**
 * Átomo: precio formateado. Si la preferencia es USD y hay cotización, muestra
 * el equivalente en dólares (display-only; el cobro sigue en ARS). Delega el
 * formateo a money.ts.
 */
export function Price({ cents, currency = "ARS", className }: PriceProps) {
  const { currency: display } = useCurrency();
  const rate = useRate();

  if (display === "USD" && rate && currency === "ARS") {
    const usd = arsCentsToUsd(cents, rate.sellArs);
    return (
      <span
        className={cn("font-semibold tabular-nums", className)}
        title={`Cotización dólar ${rate.type}`}
      >
        {formatUsd(usd)}
      </span>
    );
  }

  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {formatMoney(cents, currency)}
    </span>
  );
}
