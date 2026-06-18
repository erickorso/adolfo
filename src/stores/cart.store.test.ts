import { beforeEach, describe, expect, it } from "vitest";
import {
  selectTotalCents,
  selectTotalItems,
  useCartStore,
} from "./cart.store";
import { ItemKind } from "@/generated/prisma/client";
import type { AddToCartInput } from "@/domain/schemas/cart";

const remera: AddToCartInput = {
  refId: "p1",
  kind: ItemKind.PRODUCT,
  slug: "remera",
  name: "Remera",
  unitPriceCents: 1500000,
  currency: "ARS",
  quantity: 1,
};

const consultoria: AddToCartInput = {
  refId: "s1",
  kind: ItemKind.SERVICE,
  slug: "consultoria",
  name: "Consultoría",
  unitPriceCents: 5000000,
  currency: "ARS",
  quantity: 1,
};

describe("cart.store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("agrega un ítem nuevo", () => {
    useCartStore.getState().addItem(remera);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("acumula cantidad al agregar el mismo ítem", () => {
    const { addItem } = useCartStore.getState();
    addItem(remera);
    addItem({ ...remera, quantity: 2 });
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("no colisiona un producto y un servicio con el mismo refId", () => {
    const { addItem } = useCartStore.getState();
    addItem({ ...remera, refId: "x" });
    addItem({ ...consultoria, refId: "x" });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("setQuantity a 0 elimina el ítem", () => {
    const { addItem, setQuantity } = useCartStore.getState();
    addItem(remera);
    setQuantity(remera.refId, remera.kind, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removeItem elimina solo el ítem indicado", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(remera);
    addItem(consultoria);
    removeItem(remera.refId, remera.kind);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].refId).toBe(consultoria.refId);
  });

  it("selectores calculan totales en centavos y unidades", () => {
    const { addItem } = useCartStore.getState();
    addItem({ ...remera, quantity: 2 }); // 2 * 1.500.000 = 3.000.000
    addItem(consultoria); // 1 * 5.000.000
    const state = useCartStore.getState();
    expect(selectTotalItems(state)).toBe(3);
    expect(selectTotalCents(state)).toBe(8000000);
  });

  it("clear vacía el carrito", () => {
    const { addItem, clear } = useCartStore.getState();
    addItem(remera);
    clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
