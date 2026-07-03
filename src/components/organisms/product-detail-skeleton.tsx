import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <main
      className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading product"
    >
      <Skeleton className="aspect-square w-full rounded-lg" aria-hidden="true" />
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-7 w-28" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-2 h-10 w-36 rounded-md" />
      </div>
    </main>
  );
}
