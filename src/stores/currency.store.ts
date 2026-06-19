import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Moneda de visualización (preferencia de cliente). El cobro sigue en ARS. */
export type DisplayCurrency = "ARS" | "USD";

type CurrencyState = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
  toggle: () => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "ARS",
      setCurrency: (currency) => set({ currency }),
      toggle: () =>
        set((state) => ({
          currency: state.currency === "ARS" ? "USD" : "ARS",
        })),
    }),
    {
      name: "currency-pref",
      // El hook controla la hidratación (evita mismatch SSR).
      skipHydration: true,
    },
  ),
);
