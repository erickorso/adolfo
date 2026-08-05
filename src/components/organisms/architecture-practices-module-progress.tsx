import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Flame, Sparkles } from "lucide-react";
import type { ModuleProgressVM } from "@/domain/learning/learning.types";

type ArchitecturePracticesModuleProgressProps = {
  progress: ModuleProgressVM;
};

export async function ArchitecturePracticesModuleProgress({
  progress,
}: ArchitecturePracticesModuleProgressProps) {
  const t = await getTranslations("architecturePractices");

  return (
    <section
      className="rounded-lg border border-border bg-card p-6"
      aria-labelledby="architecture-practices-progress-heading"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="architecture-practices-progress-heading"
          className="text-lg font-semibold"
        >
          {t("progressTitle")}
        </h2>
        {progress.isLoggedIn ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
              <Sparkles className="size-4 text-amber-500" aria-hidden />
              {t("xpShort", { xp: progress.totalXp })}
            </span>
            {progress.streakDays > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
                <Flame className="size-4 text-orange-500" aria-hidden />
                {t("streakShort", { days: progress.streakDays })}
              </span>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login?callbackUrl=/learn/architecture-practices"
            className="text-sm font-medium underline"
          >
            {t("loginToTrack")}
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("progressCount", {
              done: progress.completedCount,
              total: progress.totalLessons,
            })}
          </span>
          <span className="font-medium">{progress.percent}%</span>
        </div>
        <meter
          value={progress.completedCount}
          max={progress.totalLessons || 1}
          min={0}
          className="h-3 w-full"
          aria-label={t("progressAria", { percent: progress.percent })}
        />
      </div>
    </section>
  );
}
