"use client";

import { SessionProvider } from "next-auth/react";
import { RateProvider } from "@/hooks/use-rate";
import type { RateVM } from "@/domain/money/rate.types";

/**
 * Providers de cliente: sesión (Auth.js) + cotización actual (para conversión
 * de moneda en `Price`). La tasa se resuelve en el servidor y se pasa acá.
 */
export function Providers({
  rate,
  children,
}: {
  rate: RateVM | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <RateProvider rate={rate}>{children}</RateProvider>
    </SessionProvider>
  );
}
