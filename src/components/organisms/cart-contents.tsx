"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartLineItem } from "@/components/molecules/cart-line-item";
import { Price } from "@/components/atoms/price";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

/**
 * Organismo: contenido del carrito. Conectado al store vía useCart.
 * Cubre los estados: hidratando, vacío y con ítems.
 */
export function CartContents() {
  const t = useTranslations("cart");
  const { items, totalCents, totalItems, clear, hydrated } = useCart();

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  // Antes de hidratar localStorage evitamos renderizar para no parpadear.
  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">{t("empty")}</p>
        <Link href="/" className="text-sm font-medium underline">
          {t("viewCatalog")}
        </Link>
      </div>
    );
  }

  const currency = items[0].currency;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        {items.map((item) => (
          <CartLineItem key={`${item.kind}:${item.refId}`} item={item} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("itemCount", { count: totalItems })}
        </span>
        <div className="flex items-center gap-2 text-lg">
          <span className="font-medium">{t("total")}</span>
          <Price cents={totalCents} currency={currency} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          {t("clear")}
        </Button>
        <Button type="button" size="lg" disabled>
          {t("checkout")}
        </Button>
      </div>
    </div>
  );
}
