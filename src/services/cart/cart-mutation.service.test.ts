import { beforeEach, describe, expect, it, vi } from "vitest";
import { ItemKind } from "@/generated/prisma/client";
import type { CartItem } from "@/domain/schemas/cart";

vi.mock("@/lib/cart-cookie", () => ({
  getCartFromCookie: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findFirst: vi.fn(),
    },
  },
}));

import { getCartFromCookie } from "@/lib/cart-cookie";
import { prisma } from "@/lib/prisma";
import {
  clearCartItems,
  removeCartItem,
  setCartItemQuantity,
} from "./cart-mutation.service";

const sampleItem: CartItem = {
  refId: "p1",
  kind: ItemKind.PRODUCT,
  slug: "remera",
  name: "Remera",
  unitPriceCents: 1000000,
  currency: "ARS",
  quantity: 2,
};

describe("cart-mutation.service", () => {
  beforeEach(() => {
    vi.mocked(getCartFromCookie).mockReset();
    vi.mocked(prisma.product.findFirst).mockReset();
  });

  it("clearCartItems devuelve array vacío", async () => {
    await expect(clearCartItems()).resolves.toEqual([]);
  });

  it("removeCartItem quita el ítem", async () => {
    vi.mocked(getCartFromCookie).mockResolvedValue([sampleItem]);

    const result = await removeCartItem({
      refId: "p1",
      kind: ItemKind.PRODUCT,
    });

    expect(result).toEqual({ ok: true, items: [] });
  });

  it("setCartItemQuantity valida stock de producto", async () => {
    vi.mocked(getCartFromCookie).mockResolvedValue([sampleItem]);
    vi.mocked(prisma.product.findFirst).mockResolvedValue({
      id: "p1",
      name: "Remera",
      stock: 1,
      active: true,
    } as never);

    const result = await setCartItemQuantity({
      refId: "p1",
      kind: ItemKind.PRODUCT,
      quantity: 5,
    });

    expect(result).toEqual({
      ok: false,
      error: "Stock insuficiente para Remera.",
    });
  });

  it("setCartItemQuantity actualiza cantidad válida", async () => {
    vi.mocked(getCartFromCookie).mockResolvedValue([sampleItem]);
    vi.mocked(prisma.product.findFirst).mockResolvedValue({
      id: "p1",
      name: "Remera",
      stock: 10,
      active: true,
    } as never);

    const result = await setCartItemQuantity({
      refId: "p1",
      kind: ItemKind.PRODUCT,
      quantity: 3,
    });

    expect(result).toEqual({
      ok: true,
      items: [{ ...sampleItem, quantity: 3 }],
    });
  });
});
