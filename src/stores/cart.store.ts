import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddToCartInput, CartItem } from "@/domain/schemas/cart";
import { sumLineItemsCents } from "@/lib/money";

/**
 * Store del CARRITO — estado de cliente puro (Zustand).
 * Vive en localStorage, funciona sin login y es efímero.
 *
 * REGLA DE ARQUITECTURA: el `user`/sesión NO va acá. Eso es estado de servidor
 * y lo provee Auth.js. No duplicar identidad en este store.
 */

/** Identidad única de una línea: un producto y un servicio nunca colisionan. */
function itemKey(refId: string, kind: CartItem["kind"]): string {
  return `${kind}:${refId}`;
}

type CartState = {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (refId: string, kind: CartItem["kind"]) => void;
  setQuantity: (refId: string, kind: CartItem["kind"], quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (input) =>
        set((state) => {
          const key = itemKey(input.refId, input.kind);
          const existing = state.items.find(
            (i) => itemKey(i.refId, i.kind) === key,
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.refId, i.kind) === key
                  ? { ...i, quantity: i.quantity + input.quantity }
                  : i,
              ),
            };
          }

          return { items: [...state.items, { ...input }] };
        }),

      removeItem: (refId, kind) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.refId, i.kind) !== itemKey(refId, kind),
          ),
        })),

      setQuantity: (refId, kind, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => itemKey(i.refId, i.kind) !== itemKey(refId, kind),
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              itemKey(i.refId, i.kind) === itemKey(refId, kind)
                ? { ...i, quantity }
                : i,
            ),
          };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      // Evita rehidratar en el servidor; el hook controla el flag de hidratación.
      skipHydration: true,
    },
  ),
);

// ── Selectores derivados (fuera del store, para suscripciones finas) ──

export const selectTotalItems = (state: CartState): number =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalCents = (state: CartState): number =>
  sumLineItemsCents(state.items);
