"use client";

import { useCallback } from "react";
import { Price } from "@/components/atoms/price";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ItemKind } from "@/generated/prisma/client";

export type ProductCardItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  inStock: boolean;
};

type ProductCardProps = {
  product: ProductCardItem;
};

/**
 * Molécula: tarjeta de producto.
 * Toda la lógica de evento se extrae a un handler con useCallback — nada de
 * funciones anónimas con lógica dentro del JSX.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = useCallback(() => {
    addItem({
      refId: product.id,
      kind: ItemKind.PRODUCT,
      slug: product.slug,
      name: product.name,
      unitPriceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl ?? undefined,
      quantity: 1,
    });
  }, [addItem, product]);

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
      <h3 className="text-lg font-medium">{product.name}</h3>
      {product.description ? (
        <p className="text-sm text-neutral-600">{product.description}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between">
        <Price cents={product.priceCents} currency={product.currency} />
        <Button
          type="button"
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Agregar" : "Sin stock"}
        </Button>
      </div>
    </article>
  );
}
