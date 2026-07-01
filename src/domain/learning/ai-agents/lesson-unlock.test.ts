import { describe, expect, it } from "vitest";
import { isLessonUnlocked } from "./lesson-unlock";

const loggedIn = {
  isLoggedIn: true,
  completedSlugs: [] as string[],
  quizPassedSlugs: [] as string[],
};

describe("isLessonUnlocked", () => {
  it("unlocks first lesson for logged-in users", () => {
    expect(isLessonUnlocked("course-setup", loggedIn)).toBe(true);
  });

  it("locks lesson 1 until quiz 0 passed", () => {
    expect(isLessonUnlocked("intro-to-ai-agents", loggedIn)).toBe(false);
    expect(
      isLessonUnlocked("intro-to-ai-agents", {
        ...loggedIn,
        quizPassedSlugs: ["course-setup"],
      }),
    ).toBe(true);
  });

  it("unlocks all lessons for guests", () => {
    expect(
      isLessonUnlocked("multi-agent", {
        isLoggedIn: false,
        completedSlugs: [],
        quizPassedSlugs: [],
      }),
    ).toBe(true);
  });
});
