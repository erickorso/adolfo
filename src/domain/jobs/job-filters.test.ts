import { describe, expect, it } from "vitest";
import {
  isActiveJobPosting,
  isEligibleNormalizedJob,
  isMadridJob,
  isPublicJobListing,
  matchesJsNodeJobTitle,
} from "./job-filters";

describe("matchesJsNodeJobTitle", () => {
  it("acepta React/Node/TS en título", () => {
    expect(matchesJsNodeJobTitle("Senior React Developer")).toBe(true);
    expect(matchesJsNodeJobTitle("Node.js Backend Engineer")).toBe(true);
    expect(matchesJsNodeJobTitle("Staff Software Engineer")).toBe(false);
  });
});

describe("isMadridJob", () => {
  it("detecta Madrid en location o title", () => {
    expect(isMadridJob({ location: "Madrid, Spain" })).toBe(true);
    expect(isMadridJob({ title: "Engineer in Madrid" })).toBe(true);
    expect(isMadridJob({ location: "Berlin" })).toBe(false);
  });
});

describe("isEligibleNormalizedJob", () => {
  it("requiere remoto, JS/Node en título y excluye Madrid", () => {
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Worldwide",
        title: "Senior React Developer",
      }),
    ).toBe(true);
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Worldwide",
        title: "Staff Software Engineer",
      }),
    ).toBe(false);
    expect(
      isEligibleNormalizedJob({
        remote: false,
        location: "Remote",
        title: "React Developer",
      }),
    ).toBe(false);
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Madrid",
        title: "React Developer",
      }),
    ).toBe(false);
    expect(
      isEligibleNormalizedJob({
        remote: true,
        location: "Remote",
        title: "React Developer",
        postedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      }),
    ).toBe(false);
  });
});

describe("isPublicJobListing", () => {
  it("combina remoto, JS/Node, Madrid y frescura 10 días", () => {
    const fresh = new Date();
    expect(
      isPublicJobListing({
        remote: true,
        hidden: false,
        location: "Remote",
        title: "Senior React Developer",
        fetchedAt: fresh,
        postedAt: fresh,
      }),
    ).toBe(true);
    expect(
      isPublicJobListing({
        remote: true,
        hidden: false,
        location: "Remote",
        title: "Staff Software Engineer",
        fetchedAt: fresh,
      }),
    ).toBe(false);
    expect(
      isPublicJobListing({
        remote: false,
        hidden: false,
        location: "Germany",
        title: "React Developer",
        fetchedAt: fresh,
      }),
    ).toBe(false);
    expect(
      isActiveJobPosting({
        hidden: false,
        fetchedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        postedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      }),
    ).toBe(false);
  });
});
