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

  it("passes agentic-rag with all correct answers", () => {
    const result = scoreQuizAnswers("agentic-rag", {
      "rag-1": "a",
      "rag-2": "a",
      "rag-3": "a",
    });
    expect(result?.passed).toBe(true);
  });

  it("passes intro-to-ai-agents with order question", () => {
    const result = scoreQuizAnswers("intro-to-ai-agents", {
      "intro-1": "a",
      "intro-2": "a",
      "intro-3": "a",
      "intro-4": "reason|act|observe",
    });
    expect(result?.passed).toBe(true);
    expect(result?.score).toBe(100);
  });

  it("fails when order and choices are wrong", () => {
    const result = scoreQuizAnswers("design-patterns", {
      "pat-1": "b",
      "pat-2": "b",
      "pat-3": "b",
      "pat-4": "test|goal|tools|loop",
    });
    expect(result?.passed).toBe(false);
    expect(result?.correctCount).toBe(0);
  });
});
