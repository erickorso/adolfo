import { Skeleton } from "@/components/ui/skeleton";

export default function MotionLabLoading() {
  return (
    <main
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10"
      aria-busy="true"
      aria-label="Loading motion lab"
    >
      <Skeleton className="h-8 w-40 rounded-full" />
      <Skeleton className="h-16 w-2/3 max-w-lg" />
      <Skeleton className="h-5 w-full max-w-xl" />
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full rounded-xl" />
      ))}
    </main>
  );
}
