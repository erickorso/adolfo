"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useTransition } from "react";
import { completeLessonMissionAction } from "@/app/[locale]/learn/actions";
import { YoutubeEmbed } from "@/components/molecules/youtube-embed";

type LessonVideoEmbedProps = {
  moduleId: string;
  lessonSlug: string;
  videoId: string;
  isLoggedIn: boolean;
};

export function LessonVideoEmbed({
  moduleId,
  lessonSlug,
  videoId,
  isLoggedIn,
}: LessonVideoEmbedProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const trackedRef = useRef(false);

  const trackVideoMission = useCallback(() => {
    if (!isLoggedIn || trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    startTransition(async () => {
      await completeLessonMissionAction(moduleId, lessonSlug, "video");
      router.refresh();
    });
  }, [isLoggedIn, lessonSlug, moduleId, router, startTransition]);

  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="lesson-video-heading"
    >
      <h2 id="lesson-video-heading" className="text-lg font-semibold">
        {t("videoEmbedTitle")}
      </h2>
      <YoutubeEmbed
        videoId={videoId}
        title={t("videoEmbedTitle")}
        onLoad={trackVideoMission}
      />
      <p className="text-xs text-muted-foreground">{t("videoEmbedHint")}</p>
      {pending ? (
        <p className="text-xs text-muted-foreground" role="status">
          {t("missionTracking")}
        </p>
      ) : null}
    </section>
  );
}
