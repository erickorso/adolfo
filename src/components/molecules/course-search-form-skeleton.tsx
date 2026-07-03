import { Skeleton } from "@/components/ui/skeleton";

export function CourseSearchFormSkeleton() {
  return (
    <div
      className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-1 md:col-span-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="md:col-span-4">
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}
