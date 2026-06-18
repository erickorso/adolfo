import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

type PriceProps = {
  /** Monto en centavos. */
  cents: number;
  currency?: string;
  className?: string;
};

/**
 * Átomo: renderiza un precio formateado a partir de centavos.
 * No tiene lógica de negocio; delega el formateo a `formatMoney`.
 */
export function Price({ cents, currency = "ARS", className }: PriceProps) {
  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {formatMoney(cents, currency)}
    </span>
  );
}
