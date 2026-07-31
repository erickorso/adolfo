import { describe, expect, it } from "vitest";
import { productToVM, serviceToVM } from "./catalog.mapper";
import { ItemKind } from "@/generated/prisma/client";
import type { Product, Service } from "@/generated/prisma/client";

const baseProduct: Product = {
  id: "p1",
  slug: "remera",
  name: "Remera",
  nameEn: "Tee",
  description: "Algodón",
  descriptionEn: "Cotton",
  priceCents: 1500000,
  currency: "ARS",
  stock: 5,
  imageUrl: null,
  active: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

const baseService: Service = {
  id: "s1",
  slug: "consultoria",
  name: "Consultoría",
  nameEn: "Consulting",
  description: null,
  descriptionEn: null,
  priceCents: 5000000,
  currency: "ARS",
  durationMin: 60,
  imageUrl: null,
  active: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

describe("catalog.mapper", () => {
  it("mapea un producto con stock a disponible", () => {
    const vm = productToVM(baseProduct);
    expect(vm.kind).toBe(ItemKind.PRODUCT);
    expect(vm.available).toBe(true);
    expect(vm.meta).toBeNull();
    expect(vm.name).toBe("Remera");
  });

  it("usa nameEn/descriptionEn cuando locale=en", () => {
    const vm = productToVM(baseProduct, "en");
    expect(vm.name).toBe("Tee");
    expect(vm.description).toBe("Cotton");
  });

  it("hace fallback a ES si falta nameEn", () => {
    const vm = productToVM({ ...baseProduct, nameEn: null }, "en");
    expect(vm.name).toBe("Remera");
  });

  it("marca el producto sin stock como no disponible", () => {
    const vm = productToVM({ ...baseProduct, stock: 0 });
    expect(vm.available).toBe(false);
  });

  it("mapea un servicio con su duración en meta", () => {
    const vm = serviceToVM(baseService);
    expect(vm.kind).toBe(ItemKind.SERVICE);
    expect(vm.available).toBe(true);
    expect(vm.meta).toBe("60 min");
  });

  it("servicio en inglés usa nameEn", () => {
    const vm = serviceToVM(baseService, "en");
    expect(vm.name).toBe("Consulting");
  });

  it("servicio sin duración deja meta en null", () => {
    const vm = serviceToVM({ ...baseService, durationMin: null });
    expect(vm.meta).toBeNull();
  });
});
