"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/hooks/use-cart";

type CartNavButtonProps = {
  serverItemCount?: number;
};

/**
 * Acceso al carrito en el header. `serverItemCount` viene de la cookie (SSR).
 */
export function CartNavButton({ serverItemCount = 0 }: CartNavButtonProps) {
  const t = useTranslations("nav");
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? Math.max(totalItems, serverItemCount) : serverItemCount;
  const showBadge = count > 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-sm text-foreground hover:text-foreground"
      aria-label={`${t("cart")} (${count})`}
    >
      {t("cart")}
      {showBadge ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
