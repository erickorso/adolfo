import { describe, expect, it } from "vitest";
import { isNavActive } from "./site-nav-links";

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

  it("activa courses en detalle", () => {
    expect(isNavActive("/courses/abc", "/courses")).toBe(true);
  });
});
