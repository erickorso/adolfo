import { getTranslations } from "next-intl/server";
import { Price } from "@/components/atoms/price";
import { buttonVariants } from "@/components/ui/button-variants";
import type { CartItem } from "@/domain/schemas/cart";
import { cn } from "@/lib/utils";

type CartLineItemRowProps = {
  item: CartItem;
  returnTo: string;
};

/** Línea del carrito con formularios POST (funciona sin JavaScript). */
export async function CartLineItemRow({ item, returnTo }: CartLineItemRowProps) {
  const t = await getTranslations("cart");
  const lineTotalCents = item.unitPriceCents * item.quantity;
  const nextDown = Math.max(1, item.quantity - 1);
  const nextUp = Math.min(99, item.quantity + 1);

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
        <div className="inline-flex items-center gap-2">
          {item.quantity > 1 ? (
            <form method="POST" action="/api/cart/update">
              <input type="hidden" name="refId" value={item.refId} />
              <input type="hidden" name="kind" value={item.kind} />
              <input type="hidden" name="quantity" value={nextDown} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                aria-label={t("decreaseQuantity", { name: item.name })}
              >
                −
              </button>
            </form>
          ) : (
            <form method="POST" action="/api/cart/remove">
              <input type="hidden" name="refId" value={item.refId} />
              <input type="hidden" name="kind" value={item.kind} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                aria-label={t("remove", { name: item.name })}
              >
                −
              </button>
            </form>
          )}

          <span
            className="w-6 text-center tabular-nums"
            aria-live="polite"
            aria-label={t("quantityLabel", { count: item.quantity })}
          >
            {item.quantity}
          </span>

          <form method="POST" action="/api/cart/update">
            <input type="hidden" name="refId" value={item.refId} />
            <input type="hidden" name="kind" value={item.kind} />
            <input type="hidden" name="quantity" value={nextUp} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              aria-label={t("increaseQuantity", { name: item.name })}
              disabled={item.quantity >= 99}
            >
              +
            </button>
          </form>
        </div>

        <Price
          cents={lineTotalCents}
          currency={item.currency}
          className="w-28 text-right"
        />

        <form method="POST" action="/api/cart/remove">
          <input type="hidden" name="refId" value={item.refId} />
          <input type="hidden" name="kind" value={item.kind} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            aria-label={t("remove", { name: item.name })}
          >
            {t("removeShort")}
          </button>
        </form>
      </div>
    </div>
  );
}
