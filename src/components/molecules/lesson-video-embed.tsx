"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useTransition } from "react";
import { completeLessonMissionAction } from "@/app/[locale]/learn/actions";

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

  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="lesson-video-heading"
    >
      <h2 id="lesson-video-heading" className="text-lg font-semibold">
        {t("videoEmbedTitle")}
      </h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <iframe
          title={t("videoEmbedTitle")}
          src={embedSrc}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          onLoad={trackVideoMission}
        />
      </div>
      <p className="text-xs text-muted-foreground">{t("videoEmbedHint")}</p>
      {pending ? (
        <p className="text-xs text-muted-foreground" role="status">
          {t("missionTracking")}
        </p>
      ) : null}
    </section>
  );
}
