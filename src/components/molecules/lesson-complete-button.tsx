"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { toggleLessonCompleteAction } from "@/app/[locale]/learn/actions";
import { cn } from "@/lib/utils";

type LessonCompleteButtonProps = {
  moduleId: string;
  lessonSlug: string;
  completed: boolean;
  isLoggedIn: boolean;
};

export function LessonCompleteButton({
  moduleId,
  lessonSlug,
  completed,
  isLoggedIn,
}: LessonCompleteButtonProps) {
  const t = useTranslations("aiAgents");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleLessonCompleteAction(moduleId, lessonSlug);

      if (!result.ok) {
        if (result.error === "loginRequired") {
          router.push(`/login?callbackUrl=/learn/ai-agents/${lessonSlug}`);
        }
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm text-muted-foreground">
        {isLoggedIn ? t("completeHint") : t("loginToTrack")}
      </p>
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
          completed
            ? "border border-primary bg-primary/10 text-primary"
            : "bg-primary text-primary-foreground",
        )}
        aria-pressed={completed}
        aria-label={completed ? t("markIncomplete") : t("markComplete")}
      >
        {completed ? (
          <CheckCircle2 className="size-4" aria-hidden />
        ) : (
          <Circle className="size-4" aria-hidden />
        )}
        {pending
          ? t("savingProgress")
          : completed
            ? t("completed")
            : t("markComplete")}
      </button>
    </div>
  );
}
