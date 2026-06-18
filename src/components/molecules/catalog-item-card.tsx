"use client";

import { useCallback } from "react";
import { Price } from "@/components/atoms/price";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogItemCardProps = {
  item: CatalogItemVM;
};

/**
 * Molécula: tarjeta de un ítem del catálogo (producto o servicio).
 * Genérica vía CatalogItemVM. La lógica de evento se extrae a un handler
 * (sin funciones anónimas con lógica en el JSX).
 */
export function CatalogItemCard({ item }: CatalogItemCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = useCallback(() => {
    addItem({
      refId: item.id,
      kind: item.kind,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.priceCents,
      currency: item.currency,
      imageUrl: item.imageUrl ?? undefined,
      quantity: 1,
    });
  }, [addItem, item]);

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium">{item.name}</h3>
        {item.meta ? (
          <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {item.meta}
          </span>
        ) : null}
      </div>
      {item.description ? (
        <p className="text-sm text-neutral-600">{item.description}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between">
        <Price cents={item.priceCents} currency={item.currency} />
        <Button
          type="button"
          size="sm"
          onClick={handleAddToCart}
          disabled={!item.available}
        >
          {item.available ? "Agregar" : "Sin stock"}
        </Button>
      </div>
    </article>
  );
}
