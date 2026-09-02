import { describe, expect, it } from "vitest";
import { scoreExerciseAnswer, serializeWordBankOrder } from "./score-exercise";

describe("scoreExerciseAnswer", () => {
  it("returns null for unknown exercise", () => {
    expect(scoreExerciseAnswer("unknown", "a")).toBeNull();
  });

  it("scores choice exercise correctly", () => {
    const result = scoreExerciseAnswer("greet-1", "a");
    expect(result?.correct).toBe(true);
  });

  it("scores fill-blank with normalization", () => {
    const result = scoreExerciseAnswer("greet-2", "  Am  ");
    expect(result?.correct).toBe(true);
  });

  it("scores word-bank order", () => {
    const answer = serializeWordBankOrder(["Nice", "to", "meet", "you"]);
    const result = scoreExerciseAnswer("greet-4", answer);
    expect(result?.correct).toBe(true);
  });

  it("fails wrong choice", () => {
    const result = scoreExerciseAnswer("tb-pos-1", "b");
    expect(result?.correct).toBe(false);
  });
});
