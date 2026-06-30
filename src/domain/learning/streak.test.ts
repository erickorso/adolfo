import { describe, expect, it } from "vitest";
import { computeStreakUpdate } from "./streak";

describe("computeStreakUpdate", () => {
  const day = (offset: number) =>
    new Date(Date.UTC(2026, 5, 1 + offset, 12, 0, 0));

  it("starts streak at 1 for first activity", () => {
    const now = day(0);
    const result = computeStreakUpdate(null, now);
    expect(result.streakDays).toBe(1);
    expect(result.lastActivityDate).toBe(now);
  });

  it("increments streak on consecutive days", () => {
    const now = day(1);
    const result = computeStreakUpdate(
      { streakDays: 2, lastActivityDate: day(0) },
      now,
    );
    expect(result.streakDays).toBe(3);
  });

  it("keeps streak on same day", () => {
    const now = day(0);
    const result = computeStreakUpdate(
      { streakDays: 5, lastActivityDate: day(0) },
      now,
    );
    expect(result.streakDays).toBe(5);
  });

  it("resets streak after a gap", () => {
    const now = day(3);
    const result = computeStreakUpdate(
      { streakDays: 4, lastActivityDate: day(0) },
      now,
    );
    expect(result.streakDays).toBe(1);
  });
});
