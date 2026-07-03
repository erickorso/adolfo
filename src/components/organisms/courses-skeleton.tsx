import { CourseCardSkeleton } from "@/components/molecules/course-card-skeleton";
import { CourseSearchFormSkeleton } from "@/components/molecules/course-search-form-skeleton";
import { PageHeaderSkeleton } from "@/components/molecules/page-header-skeleton";

export function CoursesSkeleton() {
  return (
    <main
      className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10"
      aria-busy="true"
      aria-label="Loading courses"
    >
      <PageHeaderSkeleton />
      <CourseSearchFormSkeleton />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index} className="flex">
            <div className="w-full">
              <CourseCardSkeleton />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
