"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
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
    toast.success(t("catalog.addedToCart", { name: item.name }));
  }, [addItem, item, t]);

  return (
    <Button type="button" size="lg" onClick={handleAdd} disabled={disabled}>
      {disabled ? t("product.outOfStock") : t("product.addToCart")}
    </Button>
  );
}
