import { describe, expect, it } from "vitest";
import { buildCertificateStatus } from "./certificate";

describe("buildCertificateStatus", () => {
  it("is not eligible with partial progress", () => {
    const status = buildCertificateStatus(["course-setup"], ["course-setup"], null);
    expect(status.eligible).toBe(false);
  });

  it("is eligible when all quizzes and lessons done", () => {
    const allSlugs = [
      "course-setup",
      "intro-to-ai-agents",
      "agentic-frameworks",
      "design-patterns",
      "tool-use",
      "agentic-rag",
      "trustworthy-agents",
      "planning-design",
      "multi-agent",
      "metacognition",
      "production",
      "agentic-protocols",
      "context-engineering",
      "agent-memory",
      "microsoft-agent-framework",
      "browser-use",
      "securing-ai-agents",
    ];
    const status = buildCertificateStatus(allSlugs, allSlugs, null);
    expect(status.eligible).toBe(true);
    expect(status.quizzesRequired).toBe(17);
  });
});
