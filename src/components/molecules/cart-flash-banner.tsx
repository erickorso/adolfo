import { getTranslations } from "next-intl/server";

type CartFlashBannerProps = {
  added?: string;
  cartError?: string;
};

/** Banner tras redirect de POST /api/cart/add (sin efectos en cliente). */
export async function CartFlashBanner({ added, cartError }: CartFlashBannerProps) {
  if (!added && !cartError) {
    return null;
  }

  const t = await getTranslations("catalog");

  return (
    <p
      role={cartError ? "alert" : "status"}
      className={
        cartError
          ? "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground"
      }
    >
      {added ? t("addedToCart", { name: added }) : cartError}
    </p>
  );
}
