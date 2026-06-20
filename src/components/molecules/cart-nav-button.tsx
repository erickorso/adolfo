"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/hooks/use-cart";

/**
 * Molécula: acceso al carrito en el header, con badge de cantidad.
 * Client porque lee el store; el badge solo aparece tras hidratar.
 */
export function CartNavButton() {
  const t = useTranslations("nav");
  const { totalItems, hydrated } = useCart();
  const showBadge = hydrated && totalItems > 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-sm text-foreground hover:text-foreground"
      aria-label={`${t("cart")} (${hydrated ? totalItems : 0})`}
    >
      {t("cart")}
      {showBadge ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
