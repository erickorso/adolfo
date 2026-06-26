import "server-only";
import { prisma } from "@/lib/prisma";
import type {
  CourseDetailVM,
  CourseEnrollmentVM,
  CourseSearchQuery,
  CourseVM,
} from "@/domain/courses/course.types";
import { courseToDetailVM, courseToVM } from "./course.mapper";

function buildWhere(query: CourseSearchQuery) {
  const q = query.q?.trim();
  return {
    hidden: false,
    ...(query.minHours ? { hours: { gte: query.minHours } } : {}),
    ...(query.location
      ? { location: { contains: query.location, mode: "insensitive" as const } }
      : {}),
    ...(query.modality
      ? { modality: { equals: query.modality, mode: "insensitive" as const } }
      : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { provider: { contains: q, mode: "insensitive" as const } },
            { sector: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function searchCourses(
  query: CourseSearchQuery = {},
): Promise<CourseVM[]> {
  const rows = await prisma.course.findMany({
    where: buildWhere(query),
    orderBy: [{ hours: "desc" }, { title: "asc" }],
    take: 100,
  });
  return rows.map(courseToVM);
}

export async function getCourseDetail(id: string): Promise<CourseDetailVM | null> {
  const row = await prisma.course.findFirst({
    where: { id, hidden: false },
  });
  return row ? courseToDetailVM(row) : null;
}

export async function isUserEnrolled(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const row = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return Boolean(row);
}

export async function enrollUser(
  userId: string,
  courseId: string,
  notes?: string | null,
): Promise<void> {
  const course = await prisma.course.findFirst({
    where: { id: courseId, hidden: false },
  });
  if (!course) {
    throw new Error("Curso no encontrado");
  }

  await prisma.courseEnrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      notes: notes?.trim() || null,
    },
    update: {
      notes: notes?.trim() || null,
    },
  });
}

export async function unenrollUser(
  userId: string,
  courseId: string,
): Promise<void> {
  await prisma.courseEnrollment.deleteMany({
    where: { userId, courseId },
  });
}

export async function listUserEnrollments(
  userId: string,
): Promise<CourseEnrollmentVM[]> {
  const rows = await prisma.courseEnrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    enrolledAt: row.createdAt,
    course: courseToVM(row.course),
  }));
}
