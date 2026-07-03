import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm"
      aria-hidden="true"
    >
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="col-span-2 h-3 w-32" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </article>
  );
}
