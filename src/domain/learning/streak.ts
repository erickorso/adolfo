type StreakInput = {
  streakDays: number;
  lastActivityDate: Date | null;
};

type StreakUpdate = {
  streakDays: number;
  lastActivityDate: Date;
};

const MS_PER_DAY = 86_400_000;

function utcDayIndex(date: Date): number {
  return Math.floor(date.getTime() / MS_PER_DAY);
}

/** Actualiza racha al completar una lección (días UTC consecutivos). */
export function computeStreakUpdate(
  profile: StreakInput | null,
  now: Date,
): StreakUpdate {
  if (!profile?.lastActivityDate) {
    return { streakDays: 1, lastActivityDate: now };
  }

  const dayDiff = utcDayIndex(now) - utcDayIndex(profile.lastActivityDate);

  if (dayDiff <= 0) {
    return {
      streakDays: profile.streakDays,
      lastActivityDate: profile.lastActivityDate,
    };
  }

  if (dayDiff === 1) {
    return {
      streakDays: profile.streakDays + 1,
      lastActivityDate: now,
    };
  }

  return { streakDays: 1, lastActivityDate: now };
}
