import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard, type ProductCardItem } from "./product-card";
import { useCartStore } from "@/stores/cart.store";

const product: ProductCardItem = {
  id: "p1",
  slug: "remera",
  name: "Remera básica",
  description: "Algodón 100%",
  priceCents: 1500000,
  currency: "ARS",
  imageUrl: null,
  inStock: true,
};

describe("ProductCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("muestra nombre y precio", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Remera básica")).toBeInTheDocument();
    expect(screen.getByText(/15\.000,00/)).toBeInTheDocument();
  });

  it("agrega al carrito al hacer click", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={product} />);

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].refId).toBe("p1");
  });

  it("deshabilita el botón cuando no hay stock", () => {
    render(<ProductCard product={{ ...product, inStock: false }} />);
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
  });
});
