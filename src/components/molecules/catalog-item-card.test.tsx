import { describe, expect, it } from "vitest";
import { renderWithIntl as render, screen } from "@/test/render";
import { CatalogItemCard } from "./catalog-item-card";
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
  it("muestra nombre y precio", () => {
    render(<CatalogItemCard item={product} />);
    expect(screen.getByText("Remera básica")).toBeInTheDocument();
    expect(screen.getByText(/15\.000,00/)).toBeInTheDocument();
  });

  it("muestra el meta de un servicio (duración)", () => {
    render(<CatalogItemCard item={service} />);
    expect(screen.getByText("60 min")).toBeInTheDocument();
  });

  it("postea a /api/cart/add con refId y kind", () => {
    render(<CatalogItemCard item={service} />);
    const form = screen.getByRole("button", { name: "Agregar" }).closest("form");
    expect(form).toHaveAttribute("action", "/api/cart/add");
    expect(form).toHaveAttribute("method", "POST");
    expect(form?.querySelector('input[name="refId"]')).toHaveValue("s1");
  });

  it("deshabilita el botón cuando no está disponible", () => {
    render(<CatalogItemCard item={{ ...product, available: false }} />);
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
  });
});
