import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl as render, screen, waitFor } from "@/test/render";
import userEvent from "@testing-library/user-event";
import { CartContents } from "./cart-contents";
import { useCartStore } from "@/stores/cart.store";
import { ItemKind } from "@/generated/prisma/client";
import type { CartItem } from "@/domain/schemas/cart";

const items: CartItem[] = [
  {
    refId: "p1",
    kind: ItemKind.PRODUCT,
    slug: "remera",
    name: "Remera",
    unitPriceCents: 1000000,
    currency: "ARS",
    quantity: 2,
  },
  {
    refId: "s1",
    kind: ItemKind.SERVICE,
    slug: "consultoria",
    name: "Consultoría",
    unitPriceCents: 5000000,
    currency: "ARS",
    quantity: 1,
  },
];

function seedCart(value: CartItem[]) {
  localStorage.setItem(
    "cart-storage",
    JSON.stringify({ state: { items: value }, version: 0 }),
  );
}

describe("CartContents", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
  });

  it("muestra el estado vacío tras hidratar", async () => {
    render(<CartContents />);
    expect(await screen.findByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("lista los ítems y calcula el total", async () => {
    seedCart(items);
    render(<CartContents />);
    // 2×$10.000 + 1×$50.000 = $70.000,00
    expect(await screen.findByText("Remera")).toBeInTheDocument();
    expect(screen.getByText("Consultoría")).toBeInTheDocument();
    expect(screen.getByText(/70\.000,00/)).toBeInTheDocument();
  });

  it("vaciar el carrito muestra el estado vacío", async () => {
    seedCart(items);
    const user = userEvent.setup();
    render(<CartContents />);

    await screen.findByText("Remera");
    await user.click(screen.getByRole("button", { name: "Vaciar carrito" }));

    await waitFor(() => {
      expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    });
  });
});
