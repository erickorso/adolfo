"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ITEM_KIND } from "@/domain/catalog/item-kind";

type AddToCartButtonProps = {
  item: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    currency: string;
    imageUrl: string | null;
  };
  disabled?: boolean;
};

/** Botón de "agregar al carrito" para la página de detalle (producto). */
export function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAdd = useCallback(() => {
    addItem({
      refId: item.id,
      kind: ITEM_KIND.PRODUCT,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.priceCents,
      currency: item.currency,
      imageUrl: item.imageUrl ?? undefined,
      quantity: 1,
    });
    toast.success(`${item.name} agregado al carrito`);
  }, [addItem, item]);

  return (
    <Button type="button" size="lg" onClick={handleAdd} disabled={disabled}>
      {disabled ? "Sin stock" : "Agregar al carrito"}
    </Button>
  );
}
