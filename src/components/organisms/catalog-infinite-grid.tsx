"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CatalogItemCard } from "@/components/molecules/catalog-item-card";
import { Button } from "@/components/ui/button";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogInfiniteGridProps = {
  kind: "product" | "service";
  initialItems: CatalogItemVM[];
  initialCursor: string | null;
};

type Page = { items: CatalogItemVM[]; nextCursor: string | null };

async function fetchCatalog(
  kind: string,
  q: string,
  cursor?: string,
): Promise<Page> {
  const params = new URLSearchParams({ kind });
  if (q) params.set("q", q);
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/catalog?${params.toString()}`);
  return (await res.json()) as Page;
}

/**
 * Organismo: grilla con búsqueda + scroll infinito (IntersectionObserver) +
 * botón "Cargar más" de respaldo. La búsqueda (con debounce) consulta nombre,
 * descripción y, en productos, las propiedades custom.
 */
export function CatalogInfiniteGrid({
  kind,
  initialItems,
  initialCursor,
}: CatalogInfiniteGridProps) {
  const t = useTranslations("catalog");
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  // Búsqueda con debounce: reinicia la lista con la primera página de `q`.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      fetchCatalog(kind, q)
        .then((page) => {
          setItems(page.items);
          setCursor(page.nextCursor);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [q, kind]);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) {
      return;
    }
    setLoading(true);
    try {
      const page = await fetchCatalog(kind, q, cursor);
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [kind, q, cursor, loading]);

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

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search")}
        className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
      />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {q
            ? t("noResults", { q })
            : kind === "product"
              ? t("emptyProducts")
              : t("emptyServices")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={`${item.kind}:${item.id}`} className="flex">
              <div className="w-full">
                <CatalogItemCard item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {cursor ? (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <Button
            type="button"
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
