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
  /** Base path for login redirect, e.g. `/learn/python-ai`. */
  progressBasePath?: string;
  /** next-intl namespace with completeHint / markComplete keys. */
  i18nNamespace?: string;
};

export function LessonCompleteButton({
  moduleId,
  lessonSlug,
  completed,
  isLoggedIn,
  progressBasePath = "/learn/ai-agents",
  i18nNamespace = "aiAgents",
}: LessonCompleteButtonProps) {
  const t = useTranslations(i18nNamespace as "aiAgents" | "pythonAi");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const loginUrl = `/login?callbackUrl=${progressBasePath}/${lessonSlug}`;

  function handleToggle() {
    if (!isLoggedIn) {
      router.push(loginUrl);
      return;
    }

    startTransition(async () => {
      const result = await toggleLessonCompleteAction(moduleId, lessonSlug);

      if (!result.ok) {
        if (result.error === "loginRequired") {
          router.push(loginUrl);
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
