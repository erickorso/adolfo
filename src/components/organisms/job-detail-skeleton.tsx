import { Skeleton } from "@/components/ui/skeleton";

export function JobDetailSkeleton() {
  return (
    <main
      className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10"
      aria-busy="true"
      aria-label="Loading job"
    >
      <header className="flex flex-col gap-2" aria-hidden="true">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-9 w-40 rounded-md" />
      </header>

      <section className="flex flex-col gap-2" aria-hidden="true">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </section>

      <section
        className="flex flex-col gap-3 rounded-lg border border-border p-4"
        aria-hidden="true"
      >
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </section>
    </main>
  );
}
