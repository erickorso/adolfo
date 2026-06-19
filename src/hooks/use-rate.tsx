"use client";

import { createContext, useContext } from "react";
import type { RateVM } from "@/domain/money/rate.types";

/**
 * Contexto con la cotización actual (resuelta en el servidor y pasada al
 * cliente). Permite que `Price` convierta ARS -> USD sin volver a pedir la tasa.
 */
const RateContext = createContext<RateVM | null>(null);

export function RateProvider({
  rate,
  children,
}: {
  rate: RateVM | null;
  children: React.ReactNode;
}) {
  return <RateContext.Provider value={rate}>{children}</RateContext.Provider>;
}

/** Cotización actual (o null si no se pudo obtener). */
export function useRate(): RateVM | null {
  return useContext(RateContext);
}
