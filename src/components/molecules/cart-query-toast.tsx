"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

type CartQueryToastProps = {
  added?: string;
  cartError?: string;
};

/** Muestra toast tras redirect de POST /api/cart/add y sincroniza Zustand. */
export function CartQueryToast({ added, cartError }: CartQueryToastProps) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const pathname = usePathname();
  const { syncFromServer } = useCart();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || (!added && !cartError)) {
      return;
    }
    handled.current = true;
    void syncFromServer().then(() => {
      if (added) {
        toast.success(t("addedToCart", { name: added }));
      }
      if (cartError) {
        toast.error(cartError);
      }
      router.replace(pathname);
    });
  }, [added, cartError, pathname, router, syncFromServer, t]);

  return null;
}
