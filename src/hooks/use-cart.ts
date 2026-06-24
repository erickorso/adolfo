"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { CartItem } from "@/domain/schemas/cart";
import {
  selectTotalCents,
  selectTotalItems,
  useCartStore,
} from "@/stores/cart.store";

function subscribeHydration(callback: () => void) {
  return useCartStore.persist.onFinishHydration(callback);
}

async function syncCartToServer(items: CartItem[]): Promise<void> {
  await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}

/** Hook de carrito. Sincroniza con cookie de servidor vía /api/cart. */
export function useCart() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    void fetch("/api/cart")
      .then((res) => res.json())
      .then((data: { items?: CartItem[] }) => {
        if (Array.isArray(data.items)) {
          useCartStore.setState({ items: data.items });
        }
      })
      .catch(() => undefined);
  }, [hydrated]);

  const items = useCartStore((s) => s.items);
  const addItemRaw = useCartStore((s) => s.addItem);
  const removeItemRaw = useCartStore((s) => s.removeItem);
  const setQuantityRaw = useCartStore((s) => s.setQuantity);
  const clearRaw = useCartStore((s) => s.clear);

  const addItem = useCallback(
    (...args: Parameters<typeof addItemRaw>) => {
      addItemRaw(...args);
      void syncCartToServer(useCartStore.getState().items);
    },
    [addItemRaw],
  );

  const removeItem = useCallback(
    (...args: Parameters<typeof removeItemRaw>) => {
      removeItemRaw(...args);
      void syncCartToServer(useCartStore.getState().items);
    },
    [removeItemRaw],
  );

  const setQuantity = useCallback(
    (...args: Parameters<typeof setQuantityRaw>) => {
      setQuantityRaw(...args);
      void syncCartToServer(useCartStore.getState().items);
    },
    [setQuantityRaw],
  );

  const clear = useCallback(() => {
    clearRaw();
    void syncCartToServer([]);
  }, [clearRaw]);

  const syncFromServer = useCallback(async () => {
    const res = await fetch("/api/cart");
    const data = (await res.json()) as { items?: CartItem[] };
    if (Array.isArray(data.items)) {
      useCartStore.setState({ items: data.items });
    }
  }, []);

  const totalItems = useCartStore(selectTotalItems);
  const totalCents = useCartStore(selectTotalCents);

  return {
    hydrated,
    items: hydrated ? items : [],
    totalItems: hydrated ? totalItems : 0,
    totalCents: hydrated ? totalCents : 0,
    addItem,
    removeItem,
    setQuantity,
    clear,
    syncFromServer,
  };
}
