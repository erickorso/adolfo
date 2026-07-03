import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <article
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </article>
  );
}
