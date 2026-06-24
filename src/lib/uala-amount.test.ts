import { describe, expect, it } from "vitest";
import { formatCentsToUalaAmount } from "./uala-amount";

describe("formatCentsToUalaAmount", () => {
  it("formatea centavos a string decimal ARS", () => {
    expect(formatCentsToUalaAmount(1500000)).toBe("15000.00");
    expect(formatCentsToUalaAmount(1090)).toBe("10.90");
  });
});
