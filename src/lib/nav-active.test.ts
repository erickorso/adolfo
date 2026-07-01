import { describe, expect, it } from "vitest";
import { isNavActive, stripLocaleFromPathname } from "./nav-active";

describe("stripLocaleFromPathname", () => {
  it("quita prefijo de locale", () => {
    expect(stripLocaleFromPathname("/en/jobs", ["es", "en"])).toBe("/jobs");
    expect(stripLocaleFromPathname("/es", ["es", "en"])).toBe("/");
  });
});

describe("isNavActive", () => {
  it("activa catalog solo en home", () => {
    expect(isNavActive("/", "/", "exact")).toBe(true);
    expect(isNavActive("/learn/ai-agents", "/", "exact")).toBe(false);
  });

  it("activa ai-agents en subrutas", () => {
    expect(isNavActive("/learn/ai-agents", "/learn/ai-agents")).toBe(true);
    expect(isNavActive("/learn/ai-agents/intro-to-ai-agents", "/learn/ai-agents")).toBe(
      true,
    );
    expect(isNavActive("/courses", "/learn/ai-agents")).toBe(false);
  });

  it("activa jobs en listado", () => {
    expect(isNavActive("/jobs", "/jobs")).toBe(true);
  });
});
