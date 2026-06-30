import type { Course } from "@/generated/prisma/client";
import type { CourseDetailVM, CourseVM } from "@/domain/courses/course.types";

export function courseToVM(row: Course): CourseVM {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    url: row.url,
    hours: row.hours,
    modality: row.modality,
    sector: row.sector,
    location: row.location,
    targetAudience: row.targetAudience,
    free: row.free,
  };
}

export function courseToDetailVM(row: Course): CourseDetailVM {
  return {
    ...courseToVM(row),
    description: row.description,
    source: row.source,
    externalId: row.externalId,
  };
}
