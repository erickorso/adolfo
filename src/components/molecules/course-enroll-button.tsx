"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  enrollCourseAction,
  unenrollCourseAction,
} from "@/app/[locale]/courses/actions";

type CourseEnrollButtonProps = {
  courseId: string;
  enrolled: boolean;
  externalUrl: string;
};

export function CourseEnrollButton({
  courseId,
  enrolled,
  externalUrl,
}: CourseEnrollButtonProps) {
  const t = useTranslations("courses");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = enrolled
        ? await unenrollCourseAction(courseId)
        : await enrollCourseAction(courseId);

      if (result.error === "loginRequired") {
        router.push(`/login?callbackUrl=/courses/${courseId}`);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        aria-pressed={enrolled}
      >
        {pending
          ? t("saving")
          : enrolled
            ? t("unregister")
            : t("register")}
      </button>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium underline"
      >
        {t("openProvider")}
      </a>
    </div>
  );
}
