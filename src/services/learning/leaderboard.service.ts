import "server-only";
import { prisma } from "@/lib/prisma";

export type LeaderboardEntryVM = {
  rank: number;
  displayName: string;
  totalXp: number;
  streakDays: number;
  isCurrentUser: boolean;
};

function formatDisplayName(
  name: string | null,
  email: string | null,
): string {
  const trimmed = name?.trim();
  if (trimmed) {
    return trimmed.split(/\s+/)[0] ?? trimmed;
  }

  const local = email?.split("@")[0]?.trim();
  if (local) {
    return local;
  }

  return "Estudiante";
}

export async function getLearningLeaderboard(
  currentUserId: string | null,
  limit = 10,
): Promise<LeaderboardEntryVM[]> {
  const rows = await prisma.learningProfile.findMany({
    where: { totalXp: { gt: 0 } },
    orderBy: [{ totalXp: "desc" }, { updatedAt: "asc" }],
    take: limit,
    select: {
      totalXp: true,
      streakDays: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return rows.map((row, index) => ({
    rank: index + 1,
    displayName: formatDisplayName(row.user.name, row.user.email),
    totalXp: row.totalXp,
    streakDays: row.streakDays,
    isCurrentUser: row.user.id === currentUserId,
  }));
}
