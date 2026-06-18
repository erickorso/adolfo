"use client";

import { useEffect, useState } from "react";
import {
  selectTotalCents,
  selectTotalItems,
  useCartStore,
} from "@/stores/cart.store";

/**
 * Hook de carrito para componentes cliente.
 * Encapsula la suscripción al store y resuelve la hidratación de `persist`
 * para evitar mismatches de SSR (en el primer render el carrito está vacío
 * hasta que localStorage rehidrata).
 */
export function useCart() {
  const [hydrated, setHydrated] = useState(() =>
    useCartStore.persist.hasHydrated(),
  );

  useEffect(() => {
    // setState va dentro del callback de hidratación (no síncrono en el effect),
    // que es lo recomendado por react-hooks.
    const unsub = useCartStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    // Rehidrata desde localStorage solo en el cliente (store con skipHydration).
    void useCartStore.persist.rehydrate();
    return unsub;
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
