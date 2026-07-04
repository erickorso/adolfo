"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Price } from "@/components/atoms/price";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ITEM_KIND } from "@/domain/catalog/item-kind";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogItemCardProps = {
  item: CatalogItemVM;
};

/**
 * Tarjeta de catálogo. Agregar usa POST HTML a /api/cart/add (sin JS obligatorio).
 * Zustand se sincroniza al volver con ?added= en la URL.
 */
export function CatalogItemCard({ item }: CatalogItemCardProps) {
  const t = useTranslations("catalog");

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="relative h-40 w-full overflow-hidden rounded-md bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium">
          {item.kind === ITEM_KIND.PRODUCT ? (
            <Link href={`/products/${item.slug}`} className="hover:underline">
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </h3>
        {item.meta ? (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {item.meta}
          </span>
        ) : null}
      </div>
      {item.description ? (
        <p className="text-sm text-muted-foreground">{item.description}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between">
        <Price cents={item.priceCents} currency={item.currency} />
        <form method="POST" action="/api/cart/add">
          <input type="hidden" name="refId" value={item.id} />
          <input type="hidden" name="kind" value={item.kind} />
          <button
            type="submit"
            disabled={!item.available}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            {item.available ? t("add") : t("outOfStock")}
          </button>
        </form>
      </div>
    </article>
  );
}
