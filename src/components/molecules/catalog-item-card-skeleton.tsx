import { Skeleton } from "@/components/ui/skeleton";

export function CatalogItemCardSkeleton() {
  return (
    <article
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      aria-hidden="true"
    >
      <Skeleton className="h-40 w-full rounded-md" />
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-auto flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </article>
  );
}
