import { describe, expect, it } from "vitest";
import { scoreQuizAnswers } from "./score-quiz";

describe("scoreQuizAnswers", () => {
  it("returns null for unknown lesson", () => {
    expect(scoreQuizAnswers("unknown", {})).toBeNull();
  });

  it("passes course-setup with all correct answers", () => {
    const result = scoreQuizAnswers("course-setup", {
      "setup-1": "a",
      "setup-2": "a",
      "setup-3": "a",
    });
    expect(result?.score).toBe(100);
    expect(result?.passed).toBe(true);
    expect(result?.correctCount).toBe(3);
  });

  it("fails with partial correct answers", () => {
    const result = scoreQuizAnswers("intro-to-ai-agents", {
      "intro-1": "a",
      "intro-2": "b",
      "intro-3": "c",
    });
    expect(result?.score).toBe(33);
    expect(result?.passed).toBe(false);
  });
});
