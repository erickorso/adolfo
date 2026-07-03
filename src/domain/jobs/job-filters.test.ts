import { describe, expect, it } from "vitest";
import {
  isActiveJobPosting,
  isEligibleNormalizedJob,
  isMadridJob,
  isPublicJobListing,
} from "./job-filters";

describe("isMadridJob", () => {
  it("detecta Madrid en location o title", () => {
    expect(isMadridJob({ location: "Madrid, Spain" })).toBe(true);
    expect(isMadridJob({ title: "Engineer in Madrid" })).toBe(true);
    expect(isMadridJob({ location: "Berlin" })).toBe(false);
  });
});

describe("isEligibleNormalizedJob", () => {
  it("requiere remoto y excluye Madrid", () => {
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Worldwide",
      }),
    ).toBe(true);
    expect(
      isEligibleNormalizedJob({
        remote: false,
        location: "Remote",
      }),
    ).toBe(false);
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Madrid",
      }),
    ).toBe(false);
  });
});

describe("isPublicJobListing", () => {
  it("combina remoto, Madrid y frescura", () => {
    const fresh = new Date();
    expect(
      isPublicJobListing({
        remote: true,
        hidden: false,
        location: "Remote",
        fetchedAt: fresh,
      }),
    ).toBe(true);
    expect(
      isPublicJobListing({
        remote: false,
        hidden: false,
        location: "Germany",
        fetchedAt: fresh,
      }),
    ).toBe(false);
    expect(
      isActiveJobPosting({
        hidden: false,
        fetchedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }),
    ).toBe(false);
  });
});
