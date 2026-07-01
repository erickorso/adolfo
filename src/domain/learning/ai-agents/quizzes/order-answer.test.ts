import { describe, expect, it } from "vitest";
import {
  isOrderCorrect,
  isSameOrder,
  serializeOrder,
  shuffleIds,
} from "./order-answer";

describe("order-answer", () => {
  it("serializa y valida orden correcto", () => {
    const order = ["reason", "act", "observe"];
    expect(serializeOrder(order)).toBe("reason|act|observe");
    expect(isOrderCorrect("reason|act|observe", order)).toBe(true);
    expect(isOrderCorrect("act|reason|observe", order)).toBe(false);
  });

  it("shuffleIds es determinístico por seed", () => {
    const ids = ["a", "b", "c", "d"];
    expect(shuffleIds(ids, "intro-4")).toEqual(shuffleIds(ids, "intro-4"));
    expect(shuffleIds(ids, "intro-4")).not.toEqual(shuffleIds(ids, "pat-4"));
  });

  it("isSameOrder compara arrays", () => {
    expect(isSameOrder(["a", "b"], ["a", "b"])).toBe(true);
    expect(isSameOrder(["b", "a"], ["a", "b"])).toBe(false);
  });
});
