"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

/**
 * Molécula: acceso al carrito en el header, con badge de cantidad.
 * Client porque lee el store; el badge solo aparece tras hidratar.
 */
export function CartNavButton() {
  const { totalItems, hydrated } = useCart();
  const showBadge = hydrated && totalItems > 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-sm text-neutral-700 hover:text-neutral-900"
      aria-label={`Carrito (${hydrated ? totalItems : 0})`}
    >
      Carrito
      {showBadge ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs text-neutral-50">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
