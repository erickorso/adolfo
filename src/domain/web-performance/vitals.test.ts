import { describe, expect, it } from "vitest";
import {
  formatWebVitalValue,
  isWebVitalName,
  percentile,
} from "./vitals";

describe("web-performance vitals", () => {
  it("valida nombres CWV", () => {
    expect(isWebVitalName("LCP")).toBe(true);
    expect(isWebVitalName("FID")).toBe(false);
  });

  it("calcula P75", () => {
    expect(percentile([1, 2, 3, 4], 75)).toBeCloseTo(3.25);
    expect(percentile([], 75)).toBeNull();
  });

  it("formatea CLS vs ms", () => {
    expect(formatWebVitalValue("CLS", 0.082)).toBe("0.082");
    expect(formatWebVitalValue("INP", 180)).toBe("180 ms");
  });
});
