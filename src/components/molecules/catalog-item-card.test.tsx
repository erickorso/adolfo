import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatalogItemCard } from "./catalog-item-card";
import { useCartStore } from "@/stores/cart.store";
import { ItemKind } from "@/generated/prisma/client";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

const product: CatalogItemVM = {
  id: "p1",
  kind: ItemKind.PRODUCT,
  slug: "remera",
  name: "Remera básica",
  description: "Algodón 100%",
  priceCents: 1500000,
  currency: "ARS",
  imageUrl: null,
  available: true,
  meta: null,
};

const service: CatalogItemVM = {
  id: "s1",
  kind: ItemKind.SERVICE,
  slug: "consultoria",
  name: "Consultoría",
  description: null,
  priceCents: 5000000,
  currency: "ARS",
  imageUrl: null,
  available: true,
  meta: "60 min",
};

describe("CatalogItemCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("muestra nombre y precio", () => {
    render(<CatalogItemCard item={product} />);
    expect(screen.getByText("Remera básica")).toBeInTheDocument();
    expect(screen.getByText(/15\.000,00/)).toBeInTheDocument();
  });

  it("muestra el meta de un servicio (duración)", () => {
    render(<CatalogItemCard item={service} />);
    expect(screen.getByText("60 min")).toBeInTheDocument();
  });

  it("agrega al carrito con el kind correcto", async () => {
    const user = userEvent.setup();
    render(<CatalogItemCard item={service} />);

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].kind).toBe(ItemKind.SERVICE);
    expect(items[0].refId).toBe("s1");
  });

  it("deshabilita el botón cuando no está disponible", () => {
    render(<CatalogItemCard item={{ ...product, available: false }} />);
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
  });
});
