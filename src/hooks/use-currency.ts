"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useCurrencyStore } from "@/stores/currency.store";

function subscribeHydration(callback: () => void) {
  return useCurrencyStore.persist.onFinishHydration(callback);
}

/**
 * Preferencia de moneda de visualización. SSR-safe (igual que useCart):
 * en el servidor el snapshot es "ARS"; en el cliente refleja la preferencia
 * persistida una vez rehidratada.
 */
export function useCurrency() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useCurrencyStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    void useCurrencyStore.persist.rehydrate();
  }, []);

  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const toggle = useCurrencyStore((s) => s.toggle);

  return {
    currency: hydrated ? currency : ("ARS" as const),
    hydrated,
    setCurrency,
    toggle,
  };
}
