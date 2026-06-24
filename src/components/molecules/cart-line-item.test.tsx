import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl as render, screen, waitFor } from "@/test/render";
import userEvent from "@testing-library/user-event";
import { resetMockCart } from "@/test/mocks/handlers";
import { CartLineItem } from "./cart-line-item";
import { useCartStore } from "@/stores/cart.store";
import { ItemKind } from "@/generated/prisma/client";
import type { CartItem } from "@/domain/schemas/cart";

const item: CartItem = {
  refId: "p1",
  kind: ItemKind.PRODUCT,
  slug: "remera",
  name: "Remera",
  unitPriceCents: 1000000,
  currency: "ARS",
  quantity: 2,
};

/** Siembra el carrito en localStorage para que la rehidratación lo cargue. */
function seedCart(items: CartItem[]) {
  localStorage.setItem(
    "cart-storage",
    JSON.stringify({ state: { items }, version: 0 }),
  );
}

describe("CartLineItem", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
  });

  it("muestra nombre y subtotal de línea (unit × cantidad)", () => {
    render(<CartLineItem item={item} />);
    expect(screen.getByText("Remera")).toBeInTheDocument();
    // 2 × $10.000,00 = $20.000,00
    expect(screen.getByText(/20\.000,00/)).toBeInTheDocument();
  });

  it("sumar cantidad actualiza el store", async () => {
    seedCart([item]);
    resetMockCart([item]);
    const user = userEvent.setup();
    render(<CartLineItem item={item} />);

    await user.click(screen.getByLabelText("Sumar uno"));

    await waitFor(() => {
      expect(useCartStore.getState().items[0]?.quantity).toBe(3);
    });
  });

  it("quitar elimina el ítem del store", async () => {
    seedCart([item]);
    resetMockCart([item]);
    const user = userEvent.setup();
    render(<CartLineItem item={item} />);

    await user.click(screen.getByRole("button", { name: "Quitar Remera" }));

    await waitFor(() => {
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });
});
