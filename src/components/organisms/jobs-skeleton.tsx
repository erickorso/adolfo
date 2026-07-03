import { JobCardSkeleton } from "@/components/molecules/job-card-skeleton";
import { PageHeaderSkeleton } from "@/components/molecules/page-header-skeleton";

export function JobsSkeleton() {
  return (
    <main
      className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10"
      aria-busy="true"
      aria-label="Loading jobs"
    >
      <PageHeaderSkeleton />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="flex">
            <div className="w-full">
              <JobCardSkeleton />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
