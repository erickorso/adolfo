import { CatalogItemCardSkeleton } from "@/components/molecules/catalog-item-card-skeleton";
import { PageHeaderSkeleton } from "@/components/molecules/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type CatalogSectionSkeletonProps = {
  cardCount?: number;
};

function CatalogSectionSkeleton({ cardCount = 3 }: CatalogSectionSkeletonProps) {
  return (
    <section className="flex flex-col gap-4" aria-hidden="true">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-10 w-full max-w-sm rounded-md" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <li key={index} className="flex">
            <div className="w-full">
              <CatalogItemCardSkeleton />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CatalogSkeleton() {
  return (
    <main
      className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10"
      aria-busy="true"
      aria-label="Loading catalog"
    >
      <PageHeaderSkeleton />
      <CatalogSectionSkeleton />
      <CatalogSectionSkeleton />
    </main>
  );
}
