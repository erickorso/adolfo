import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Price } from "@/components/atoms/price";
import { CartLineItemRow } from "@/components/molecules/cart-line-item-row";
import { buttonVariants } from "@/components/ui/button";
import type { CartItem } from "@/domain/schemas/cart";
import { getAppBaseUrl } from "@/lib/app-url";
import { sumLineItemsCents } from "@/lib/money";
import { cn } from "@/lib/utils";

type CartPanelProps = {
  items: CartItem[];
  checkoutError?: string;
  cartError?: string;
};

/** Panel del carrito renderizado en servidor (mutaciones vía POST nativo). */
export async function CartPanel({
  items,
  checkoutError,
  cartError,
}: CartPanelProps) {
  const t = await getTranslations("cart");
  const locale = await getLocale();
  const returnTo = `${getAppBaseUrl()}/${locale}/cart`;

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

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const totalCents = sumLineItemsCents(items);
  const currency = items[0]?.currency ?? "ARS";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        {items.map((item) => (
          <CartLineItemRow
            key={`${item.kind}:${item.refId}`}
            item={item}
            returnTo={returnTo}
          />
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

      {cartError ? (
        <p className="text-sm text-destructive" role="alert">
          {cartError}
        </p>
      ) : null}

      {checkoutError ? (
        <p className="text-sm text-destructive" role="alert">
          {checkoutError}
        </p>
      ) : null}

      <div className="flex items-center justify-between">
        <form method="POST" action="/api/cart/clear">
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="text-sm text-muted-foreground underline"
          >
            {t("clear")}
          </button>
        </form>
        <form method="POST" action="/api/checkout">
          <button type="submit" className={cn(buttonVariants({ size: "lg" }))}>
            {t("checkout")}
          </button>
        </form>
      </div>
    </div>
  );
}
