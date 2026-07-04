import { describe, expect, it } from "vitest";
import { mapSectionProgressToReveal } from "./use-motion-section-progress";

describe("mapSectionProgressToReveal", () => {
  it("mapea progreso de sección a reveal 0-1", () => {
    expect(mapSectionProgressToReveal(0)).toBe(0);
    expect(mapSectionProgressToReveal(0.5)).toBeCloseTo(0.5, 1);
    expect(mapSectionProgressToReveal(1)).toBe(1);
  });
});
