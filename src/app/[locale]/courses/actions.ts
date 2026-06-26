"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/services/users/user.service";
import {
  enrollUser,
  unenrollUser,
} from "@/services/courses/course.service";

export type CourseActionResult = {
  ok: boolean;
  error?: string;
};

export async function enrollCourseAction(
  courseId: string,
): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  try {
    await enrollUser(user.id, courseId);
    revalidatePath("/courses");
    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/account/courses");
    return { ok: true };
  } catch {
    return { ok: false, error: "notFound" };
  }
}

export async function unenrollCourseAction(
  courseId: string,
): Promise<CourseActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "loginRequired" };
  }

  await unenrollUser(user.id, courseId);
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/account/courses");
  return { ok: true };
}
