"use client";

import { useCallback } from "react";
import { Price } from "@/components/atoms/price";
import { QuantityStepper } from "@/components/atoms/quantity-stepper";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/domain/schemas/cart";

type CartLineItemProps = {
  item: CartItem;
};

/**
 * Molécula: línea del carrito. Conectada al store vía useCart.
 * Handlers extraídos con useCallback (sin lógica anónima en el JSX).
 */
export function CartLineItem({ item }: CartLineItemProps) {
  const { setQuantity, removeItem } = useCart();

  const handleQuantityChange = useCallback(
    (next: number) => {
      setQuantity(item.refId, item.kind, next);
    },
    [setQuantity, item.refId, item.kind],
  );

  const handleRemove = useCallback(() => {
    removeItem(item.refId, item.kind);
  }, [removeItem, item.refId, item.kind]);

  const lineTotalCents = item.unitPriceCents * item.quantity;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{item.name}</span>
        <Price
          cents={item.unitPriceCents}
          currency={item.currency}
          className="text-sm font-normal text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-4">
        <QuantityStepper value={item.quantity} onChange={handleQuantityChange} />
        <Price cents={lineTotalCents} currency={item.currency} className="w-28 text-right" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          aria-label={`Quitar ${item.name}`}
        >
          Quitar
        </Button>
      </div>
    </div>
  );
}
