import { CatalogItemCard } from "@/components/molecules/catalog-item-card";
import type { CatalogItemVM } from "@/domain/view/catalog-item";

type CatalogGridProps = {
  items: CatalogItemVM[];
  /** Mensaje cuando no hay ítems (empty state). */
  emptyMessage?: string;
};

/**
 * Organismo: grilla de ítems del catálogo. Maneja el estado vacío.
 * Es un Server Component que renderiza tarjetas cliente.
 */
export function CatalogGrid({
  items,
  emptyMessage = "No hay ítems disponibles por ahora.",
}: CatalogGridProps) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={`${item.kind}:${item.id}`} className="flex">
          <div className="w-full">
            <CatalogItemCard item={item} />
          </div>
        </li>
      ))}
    </ul>
  );
}
