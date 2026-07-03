import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-2" aria-hidden="true">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-full max-w-md" />
    </header>
  );
}
