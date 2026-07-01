import { describe, expect, it } from "vitest";
import { buildCertificateStatus } from "@/domain/learning/ai-agents/certificate";
import { AI_AGENTS_LESSONS } from "@/domain/learning/ai-agents/lessons";
import { resolveNextStep, type LessonStepInput } from "@/domain/learning/ai-agents/next-step";

function emptyLessons(): LessonStepInput[] {
  return AI_AGENTS_LESSONS.map((lesson) => ({
    slug: lesson.slug,
    hasVideo: Boolean(lesson.videoId),
    missions: { readme: false, video: false, code: false },
    completed: false,
    quizPassed: false,
  }));
}

describe("resolveNextStep", () => {
  it("sugiere misiones en la primera lección desbloqueada", () => {
    const unlock = { isLoggedIn: true, completedSlugs: [], quizPassedSlugs: [] };
    const certificate = buildCertificateStatus([], [], null);

    const step = resolveNextStep(unlock, emptyLessons(), certificate);

    expect(step).toEqual({
      type: "lesson",
      slug: "course-setup",
      focus: "missions",
    });
  });

  it("prioriza quiz cuando misiones están hechas", () => {
    const unlock = { isLoggedIn: true, completedSlugs: [], quizPassedSlugs: [] };
    const lessons = emptyLessons();
    lessons[0] = {
      ...lessons[0]!,
      missions: { readme: true, video: false, code: true },
      quizPassed: false,
    };

    const step = resolveNextStep(
      unlock,
      lessons,
      buildCertificateStatus([], [], null),
    );

    expect(step).toEqual({
      type: "lesson",
      slug: "course-setup",
      focus: "quiz",
    });
  });

  it("sugiere certificado cuando es elegible", () => {
    const allSlugs = AI_AGENTS_LESSONS.map((l) => l.slug);
    const unlock = {
      isLoggedIn: true,
      completedSlugs: allSlugs,
      quizPassedSlugs: allSlugs,
    };
    const lessons = emptyLessons().map((l) => ({
      ...l,
      missions: { readme: true, video: true, code: true },
      completed: true,
      quizPassed: true,
    }));

    const step = resolveNextStep(
      unlock,
      lessons,
      buildCertificateStatus(allSlugs, allSlugs, null),
    );

    expect(step).toEqual({ type: "certificate" });
  });
});
