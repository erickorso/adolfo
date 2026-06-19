"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CatalogItemCard } from "@/components/molecules/catalog-item-card";
import { Button } from "@/components/ui/button";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogInfiniteGridProps = {
  kind: "product" | "service";
  initialItems: CatalogItemVM[];
  initialCursor: string | null;
  emptyMessage: string;
};

/**
 * Organismo: grilla con scroll infinito (IntersectionObserver) + botón "Cargar
 * más" de respaldo. La primera página llega del servidor; las siguientes vía
 * /api/catalog. Las imágenes hacen lazy load (next/image en la card).
 */
export function CatalogInfiniteGrid({
  kind,
  initialItems,
  initialCursor,
  emptyMessage,
}: CatalogInfiniteGridProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/catalog?kind=${kind}&cursor=${cursor}`);
      const page = (await res.json()) as {
        items: CatalogItemVM[];
        nextCursor: string | null;
      };
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [kind, cursor, loading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !cursor) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void loadMore();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, cursor]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.kind}:${item.id}`} className="flex">
            <div className="w-full">
              <CatalogItemCard item={item} />
            </div>
          </li>
        ))}
      </ul>
      {cursor ? (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <Button
            type="button"
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Cargando…" : "Cargar más"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
