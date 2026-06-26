import { CoursesTemplate } from "@/components/templates/courses-template";
import { searchCourses } from "@/services/courses/course.service";

type CoursesPageProps = {
  searchParams: Promise<{
    q?: string;
    minHours?: string;
    location?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const minHours = params.minHours ? Number(params.minHours) : undefined;

  const initialQuery = {
    q: params.q,
    minHours: Number.isFinite(minHours) ? minHours : undefined,
    location: params.location,
  };

  const courses = await searchCourses(initialQuery);

  return <CoursesTemplate courses={courses} initialQuery={initialQuery} />;
}
