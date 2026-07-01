"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { completeLessonMissionAction } from "@/app/[locale]/learn/actions";
import type { LessonMissionKind } from "@/services/learning/lesson-progress.service";

type LessonResourceLinksProps = {
  moduleId: string;
  lessonSlug: string;
  isLoggedIn: boolean;
  readmeHref: string;
  codeHref: string;
  videoHref?: string;
};

export function LessonResourceLinks({
  moduleId,
  lessonSlug,
  isLoggedIn,
  readmeHref,
  codeHref,
  videoHref,
}: LessonResourceLinksProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function trackAndOpen(kind: LessonMissionKind, href: string) {
    if (!isLoggedIn) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    startTransition(async () => {
      await completeLessonMissionAction(moduleId, lessonSlug, kind);
      router.refresh();
      window.open(href, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <ul className="flex flex-col gap-2 text-sm">
      <li>
        <button
          type="button"
          disabled={pending}
          onClick={() => trackAndOpen("readme", readmeHref)}
          className="font-medium underline disabled:opacity-60"
        >
          {t("readmeLink")}
        </button>
      </li>
      <li>
        <button
          type="button"
          disabled={pending}
          onClick={() => trackAndOpen("code", codeHref)}
          className="font-medium underline disabled:opacity-60"
        >
          {t("codeLink")}
        </button>
      </li>
      {videoHref ? (
        <li>
          <button
            type="button"
            disabled={pending}
            onClick={() => trackAndOpen("video", videoHref)}
            className="font-medium underline disabled:opacity-60"
          >
            {t("videoLinkExternal")}
          </button>
        </li>
      ) : null}
    </ul>
  );
}
