"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toggleLessonMissionAction } from "@/app/[locale]/learn/actions";
import type { LessonMissionState } from "@/services/learning/lesson-progress.service";
import { cn } from "@/lib/utils";

type LessonMissionsProps = {
  moduleId: string;
  lessonSlug: string;
  hasVideo: boolean;
  isLoggedIn: boolean;
  missions: LessonMissionState;
};

export function LessonMissions({
  moduleId,
  lessonSlug,
  hasVideo,
  isLoggedIn,
  missions,
}: LessonMissionsProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle(kind: "readme" | "video" | "code") {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleLessonMissionAction(moduleId, lessonSlug, kind);
      if (!result.ok && result.error === "loginRequired") {
        router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
        return;
      }
      router.refresh();
    });
  }

  const items: Array<{
    kind: "readme" | "video" | "code";
    label: string;
    done: boolean;
    visible: boolean;
  }> = [
    { kind: "readme", label: t("missionReadme"), done: missions.readme, visible: true },
    { kind: "video", label: t("missionVideo"), done: missions.video, visible: hasVideo },
    { kind: "code", label: t("missionCode"), done: missions.code, visible: true },
  ];

  return (
    <section
      className="rounded-lg border border-border bg-card p-6"
      aria-labelledby="lesson-missions-heading"
    >
      <h2 id="lesson-missions-heading" className="mb-2 text-lg font-semibold">
        {t("missionsTitle")}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("missionsHint")}</p>
      <ul className="flex flex-col gap-2">
        {items.flatMap((item) =>
          item.visible
            ? [
                <li key={item.kind}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggle(item.kind)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60",
                      item.done
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-muted/50",
                    )}
                    aria-pressed={item.done}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        item.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground",
                      )}
                      aria-hidden
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    {item.label}
                  </button>
                </li>,
              ]
            : [],
        )}
      </ul>
    </section>
  );
}
