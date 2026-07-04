"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
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

/** Agregar al carrito en detalle — POST HTML nativo. */
export function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const t = useTranslations();

  return (
    <form method="POST" action="/api/cart/add">
      <input type="hidden" name="refId" value={item.id} />
      <input type="hidden" name="kind" value={ITEM_KIND.PRODUCT} />
      <button
        type="submit"
        disabled={disabled}
        className={cn(buttonVariants({ size: "lg" }))}
      >
        {disabled ? t("product.outOfStock") : t("product.addToCart")}
      </button>
    </form>
  );
}
