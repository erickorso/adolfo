import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type LearnModuleShellSkeletonProps = {
  children?: ReactNode;
};

export function LearnModuleShellSkeleton({ children }: LearnModuleShellSkeletonProps) {
  return (
    <div
      className="learn-path mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10"
      aria-busy="true"
    >
      <header className="learn-path__hero flex flex-col gap-3" aria-hidden="true">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </header>
      {children}
    </div>
  );
}

function LearnPathCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <section
      className="learn-path__card flex flex-col gap-3 p-6"
      aria-hidden="true"
    >
      <Skeleton className="h-6 w-40" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </section>
  );
}

export function AiAgentsCourseSkeleton() {
  return (
    <LearnModuleShellSkeleton>
      <section className="learn-path__card p-6" aria-hidden="true">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="learn-path__meter h-3 w-full rounded-full" />
        </div>
      </section>

      <LearnPathCardSkeleton lines={2} />
      <LearnPathCardSkeleton lines={4} />
      <LearnPathCardSkeleton lines={3} />

      <section className="learn-path__card p-6" aria-hidden="true">
        <Skeleton className="mb-4 h-6 w-32" />
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </LearnModuleShellSkeleton>
  );
}

export function AiAgentsLessonSkeleton() {
  return (
    <LearnModuleShellSkeleton>
      <article className="flex flex-col gap-6" aria-hidden="true">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </section>
        <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </section>
        <div className="flex justify-between gap-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </article>
    </LearnModuleShellSkeleton>
  );
}
