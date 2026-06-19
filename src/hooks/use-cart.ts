"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  selectTotalCents,
  selectTotalItems,
  useCartStore,
} from "@/stores/cart.store";

/** Suscribe al evento de fin de hidratación del store persistido. */
function subscribeHydration(callback: () => void) {
  return useCartStore.persist.onFinishHydration(callback);
}

/**
 * Hook de carrito para componentes cliente.
 *
 * La hidratación se resuelve con useSyncExternalStore: en el servidor el
 * snapshot es `false` (no se toca `persist`), evitando el error de SSR; en el
 * cliente refleja el estado real de la rehidratación desde localStorage.
 */
export function useCart() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    // Store con skipHydration: disparamos la rehidratación solo en el cliente.
    void useCartStore.persist.rehydrate();
  }, []);

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);

  const totalItems = useCartStore(selectTotalItems);
  const totalCents = useCartStore(selectTotalCents);

  return {
    /** false hasta que localStorage rehidrató; útil para evitar parpadeos. */
    hydrated,
    items: hydrated ? items : [],
    totalItems: hydrated ? totalItems : 0,
    totalCents: hydrated ? totalCents : 0,
    addItem,
    removeItem,
    setQuantity,
    clear,
  };
}
