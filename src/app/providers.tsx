"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { RateProvider } from "@/hooks/use-rate";
import type { RateVM } from "@/domain/money/rate.types";

/**
 * Providers de cliente: tema (next-themes), sesión (Auth.js) y cotización actual
 * (para conversión de moneda en `Price`).
 */
export function Providers({
  rate,
  children,
}: {
  rate: RateVM | null;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <RateProvider rate={rate}>{children}</RateProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
