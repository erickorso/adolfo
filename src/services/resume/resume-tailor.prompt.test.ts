import { describe, expect, it } from "vitest";
import {
  buildResumePrompt,
  parseImprovement,
  type TailorInput,
} from "./resume-tailor.prompt";

const input: TailorInput = {
  resumeText: "Erick Vargas, Frontend Engineer, React.",
  jobTitle: "Senior Frontend Engineer",
  jobCompany: "Acme",
  jobDescription: "Buscamos React + TypeScript.",
};

describe("buildResumePrompt", () => {
  it("incluye oferta y CV, y pide JSON", () => {
    const { system, prompt } = buildResumePrompt(input);
    expect(system).toMatch(/CV/i);
    expect(prompt).toContain("Senior Frontend Engineer");
    expect(prompt).toContain("Acme");
    expect(prompt).toContain("Erick Vargas");
    expect(prompt).toMatch(/JSON/);
  });
});

describe("parseImprovement", () => {
  it("parsea JSON limpio", () => {
    const raw = JSON.stringify({ suggestions: "- mejorá X", rewrite: "# CV" });
    expect(parseImprovement(raw)).toEqual({
      suggestions: "- mejorá X",
      rewrite: "# CV",
    });
  });

  it("tolera fences ```json y texto alrededor", () => {
    const raw = 'Acá va:\n```json\n{"suggestions":"a","rewrite":"b"}\n```\nlisto';
    expect(parseImprovement(raw)).toEqual({ suggestions: "a", rewrite: "b" });
  });

  it("falla si no hay objeto JSON", () => {
    expect(() => parseImprovement("sin json")).toThrow();
  });

  it("falla si faltan campos requeridos", () => {
    expect(() => parseImprovement('{"suggestions":"a"}')).toThrow();
  });
});
