import { getTranslations } from "next-intl/server";
import { Flame, Sparkles, Trophy } from "lucide-react";
import type { LeaderboardEntryVM } from "@/services/learning/leaderboard.service";
import { cn } from "@/lib/utils";

type AiAgentsLeaderboardProps = {
  entries: LeaderboardEntryVM[];
};

export async function AiAgentsLeaderboard({
  entries,
}: AiAgentsLeaderboardProps) {
  if (entries.length === 0) {
    return null;
  }

  const t = await getTranslations("aiAgents");

  return (
    <section
      className="rounded-lg border border-border bg-card p-6"
      aria-labelledby="leaderboard-heading"
    >
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="size-5 text-amber-500" aria-hidden />
        <h2 id="leaderboard-heading" className="text-lg font-semibold">
          {t("leaderboardTitle")}
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{t("leaderboardHint")}</p>
      <ol className="flex flex-col gap-2" aria-label={t("leaderboardTitle")}>
        {entries.map((entry) => (
          <li
            key={`${entry.rank}-${entry.displayName}`}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm",
              entry.isCurrentUser
                ? "border-primary bg-primary/5"
                : "border-border",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold"
                aria-label={t("leaderboardRank", { rank: entry.rank })}
              >
                {entry.rank}
              </span>
              <span className="truncate font-medium">
                {entry.displayName}
                {entry.isCurrentUser ? (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({t("leaderboardYou")})
                  </span>
                ) : null}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
              {entry.streakDays > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3 text-orange-500" aria-hidden />
                  {entry.streakDays}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Sparkles className="size-3 text-amber-500" aria-hidden />
                {t("xpShort", { xp: entry.totalXp })}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
